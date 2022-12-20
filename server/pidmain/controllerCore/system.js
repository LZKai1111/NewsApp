const objectId = require("mongodb").ObjectID;
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const config = require("../config/app.json");

const privateAccessFolder = path.resolve(
  process.cwd(),
  config.userFileStorage.privateAccess.folderPath
);
const galleryFolder = `${privateAccessFolder}`;

const fileCol = require("../dataModel/core/fileCol");
const commandCol = require("../dataModel/commandCol");
const eventStoreCol = require("../dataModel/eventStoreCol");
const accObjRelCol = require("../dataModel/core/accObjRelCol");

const defaultPage = 1;
const defaultRecordPerPage = 20;

const userAvatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, galleryFolder);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.query["refCode"]}_${Date.now()}_${file.originalname}`);
  },
});

const avatarUploadSetting = multer({
  storage: userAvatarStorage,
  limits: { fieldSize: 25 * 1024 * 1024 },
}).single("file");

let refTypes = ["policy", "locationService", "serviceItem"];
async function fileUpload(req, res) {
  let refCode = req.query["refCode"];
  let refType = req.query["refType"];

  if (!refTypes.includes(refType)) {
    return res.json({
      errCode: 1,
      errDetail: {
        vi: "",
        en: "invalid type",
      },
      result: {
        reqQuery: req.query,
      },
    });
  }

  avatarUploadSetting(req, res, async function (err) {
    if (err) {
      console.log(err);
      return res.json({
        errCode: 1,
        errDetail: {
          vi: "",
          en: "parser error",
        },
        result: err,
      });
    }

    console.log(req.file);

    let thumbnails = await generateThumbnails(req.file.path, req.file.filename);
    let newFile = await fileCol.insertOne(refCode, refType, thumbnails, {
      code: req.user.code,
    });
    respond(newFile);
  });

  function customParseStream() {
    let fileName = `temp`;
    let filePath = `${galleryFolder}/${fileName}`;
    console.log(filePath);
    req.pipe(fs.createWriteStream(filePath));

    async function done() {
      console.log("done");

      let thumbnails = await generateThumbnails(filePath, fileName);
      let newFile = fileCol.insertOne(policyCode, thumbnails, {
        code: req.user.code,
      });
      respond(newFile);
    }

    req.on("end", done);
  }

  function respond(newFile) {
    res.json({
      err: null,
      errMsg: null,
      result: {
        fileAdded: newFile,
      },
    });
  }

  async function generateThumbnails(filePath, fileName) {
    const googleCloudPath = `photo/${fileName}`;

    let _origin = fileResize.getThumbnails(
      filePath,
      `${googleCloudPath}`,
      "original"
    );
    let _width300px = fileResize.getThumbnails(
      filePath,
      `${googleCloudPath}_width300px`,
      "width300px"
    );
    let _width180px = fileResize.getThumbnails(
      filePath,
      `${googleCloudPath}_width180px`,
      "width180px"
    );
    let _width70px = fileResize.getThumbnails(
      filePath,
      `${googleCloudPath}_width70px`,
      "width70px"
    );

    const finalResult = [
      await _origin,
      await _width300px,
      await _width180px,
      await _width70px,
    ];

    const thumbnails = {
      origin: finalResult[0],
      width300px: finalResult[1],
      width180px: finalResult[2],
      width70px: finalResult[3],
    };

    return thumbnails;
  }
}

async function loadFile(req, res) {
  let filename = req.params.filename;
  let googleCloudPath = `photo/${filename}`;
  googleCloudStorage.getStream(googleCloudPath, res);
}

async function deleteFile(req, res) {
  let relation = await accObjRelCol.findByRelation(
    req.user.code,
    req.query.refCode
  );

  if (!relation) {
    return res.json({
      errCode: 1,
      errDetail: "not authorize",
      result: {
        reqUser: req.user,
        reqParams: req.params,
        reqQuery: req.query,
      },
    });
  }

  await fileCol.deleteFile(req.params.fileId, req.query.refCode);

  return res.json({
    errCode: null,
    errDetail: {
      vi: "",
    },
    result: "ok",
  });
}

async function addCommand(req, res, next) {
  let body = req.body;

  let result = await commandCol.insertOne(body);

  req["newCommand"] = result;

  next();
}

async function test(req, res) {
  return res.json({
    errCode: null,
    errDetail: {
      vi: "",
    },
    result: req.commandName,
  });
}

async function systemEvent(req, res) {
  let page = defaultPage;
  let recordPerPage = defaultRecordPerPage;
  let sort = { eventRecorded: -1 };

  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  if (req.query.limit) {
    recordPerPage = parseInt(req.query.limit);
  }

  let result = await eventStoreCol.loadAllEvent(sort, page, recordPerPage);

  return res.json({
    errCode: null,
    errDetail: {
      vi: "",
    },
    result: result,
  });
}

module.exports = {
  fileUpload: fileUpload,
  loadFile: loadFile,
  deleteFile: deleteFile,
  addCommand: addCommand,
  test: test,
  systemEvent: systemEvent,
};
