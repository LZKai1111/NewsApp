const objectId = require("mongodb").ObjectID;

const database = require("../../integration/mongodbCloud/database");
const accCommandCol = require("../../dataModel/core/accCommandCol");

async function listUserCommand(req, res) {
  let result = await accCommandCol.loadCommandGroupByCommand();

  return res.json({
    errCode: null,
    errDetail: null,
    result: {
      data: result,
    },
  });
}

async function addUserCommand(req, res) {
  console.log(req.body);

  let command = JSON.parse(req.body.command);
  let userCode = req.body.userCode;
  let start = new Date(req.body.start);
  let end = req.body.end ? new Date(req.body.end) : null;

  let duplicate = await accCommandCol.checkDuplicate(
    userCode,
    command,
    start,
    end
  );

  if (duplicate.length > 0) {
    return res.json({
      errCode: 1,
      errDetail: "duplicate",
      result: {
        duplicate: duplicate,
      },
    });
  }

  let result = await accCommandCol.insertOne(userCode, command, start, end);

  return res.json({
    errCode: null,
    errDetail: null,
    result: result,
  });
}

async function deactiveUserCommand(req, res) {
  console.log(req.user);
  console.log(req.userCommands);

  console.log(req.commandName);
  console.log(req.params);

  let filter = {
    _id: new objectId(req.params.userCommandId),
  };

  let update = {
    end: new Date(req.body.end),
  };

  let options = {
    returnOriginal: false,
  };

  let result = await database
    .accCommandCol()
    .findOneAndUpdate(filter, { $set: update }, options);

  return res.json({
    errCode: null,
    errDetail: null,
    result: result.value,
  });
}

module.exports = {
  listUserCommand: listUserCommand,
  addUserCommand: addUserCommand,
  deactiveUserCommand: deactiveUserCommand,
};
