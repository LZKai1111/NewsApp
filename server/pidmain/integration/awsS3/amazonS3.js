var AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const config = path.resolve(process.cwd(), "./config/s3.json");
console.log(config);

BUCKET_NAME = "newsapp185";


AWS.config.loadFromPath(config);

AWS.config.update({ region: "ap-southeast-1" });
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

async function upload(file, Key, cb) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: Key,
    ACL: "private",
    Body: fs.readFileSync(file),
  };

  console.log("File: " + file);

  s3.upload(params, function (err, data) {
    if (err) {
      console.log("Error: ", err);
    } else {
      cb(data);
      console.log(data);
    }
  });
}

async function uploadFileWithData(file, Key, cb) {
  const buf = new Buffer(file.replace(/^data:image\/\w+;base64,/, ""),'base64')
  const params = {
    Bucket: BUCKET_NAME,
    Key: Key,
    ACL: "private",
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: 'image/png'
  };

  s3.upload(params, function (err, data) {
    if (err) {
      console.log("Error: ", err);
    } else {
      cb(data);
      console.log(data);
    }
  });
}

async function getListOfFolder(key, cb) {
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: key,
  };

  s3.listObjectsV2(params, function (e, data) {
    cb(data.Contents);
  });
}

function download(key, cb) {
  var options = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  return s3.getObject(options).createReadStream().on('error', error => {
    cb(error);
  });
}

module.exports = {
  upload,
  getListOfFolder,
  download,
  uploadFileWithData
};
