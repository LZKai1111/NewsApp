const database = require("../../integration/mongodbCloud/database");

async function insertOne(userCode, command, start, end) {
  let record = {
    userCode: userCode,
    command: `${command.handlerName}-${command.command}`,
    params: {},
    start: start,
    end: end,
  };

  let result = await database.userCommandCol().insertOne(record);
  return result;
}

async function checkDuplicate(userCode, command, start, end) {
  let record = {
    userCode: userCode,
    command: `${command.handlerName}-${command.command}`,
    end: {
      $gt: start,
    },
  };

  let result = await database.userCommandCol().find(record).toArray();
  return result;
}

async function checkCommandExist(userCode, command) {
  let record = {
    userCode: userCode,
    command: command,
    $or: [{ end: { $lt: new Date() } }, { end: null }],
  };

  let result = await database.userCommandCol().find(record).toArray();
  return result;
}

async function loadCommandGroupByUser(listUserCode) {
  let pipeline = [];

  if (listUserCode) {
    let match = {
      userCode: {
        $in: listUserCode,
      },
    };

    pipeline.push({ $match: match });
  }

  let groupByUserCode = {
    _id: "$userCode",
    commands: { $push: "$$ROOT" },
  };
  pipeline.push({ $group: groupByUserCode });

  const result = await database.userCommandCol().aggregate(pipeline).toArray();
  return result[0];
}

async function loadCommandGroupByCommand(listUserCode) {
  let pipeline = [];

  if (listUserCode) {
    let match = {
      userCode: {
        $in: listUserCode,
      },
    };

    pipeline.push({ $match: match });
  }

  let groupByUserCode = {
    _id: "$command",
    users: { $push: "$$ROOT" },
  };
  pipeline.push({ $group: groupByUserCode });

  const result = await database.userCommandCol().aggregate(pipeline).toArray();
  return result[0];
}

module.exports = {
  loadCommandGroupByUser: loadCommandGroupByUser,
  loadCommandGroupByCommand: loadCommandGroupByCommand,
  insertOne: insertOne,
  checkDuplicate: checkDuplicate,
  checkCommandExist: checkCommandExist,
};
