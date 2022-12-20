const database = require("../integration/mongodbCloud/database");

async function insertOne(data) {
  let newCommand = {
    command: data.command,
    handlerName: data.handlerName,
    method: "get",
    endpoint: data.endpoint,
    middlewares: [],
    abac: [],
    name: {
      vi: ``,
      en: `Create command`,
    },
    des: {
      vi: ``,
      en: `Create command`,
    },
  };

  let result = await database.commandCol().insertOne(newCommand);
  return result.ops[0];
}

async function loadCommands() {
  let result = await database.commandCol().find({}).toArray();
  return result;
}

module.exports = {
  insertOne: insertOne,
  loadCommands: loadCommands,
};
