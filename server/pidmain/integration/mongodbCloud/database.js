const { MongoClient } = require("mongodb");
const config = require("../../config/database");

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: false
};

// Core
let _idCol = null;
let _accCommandCol = null;
let _commandCol = null;
let _fileCol = null;
let _accountObjectCol = null;
let _eventStoreCol = null;
let _integrateLogCol = null;

// Authenticate
let _userCol = null;

// Custom
let _articleCol = null;
let _commentCol = null;

let dbClient = null;

async function connectDatabase(cb) {
  const client = new MongoClient(config.uri, connectOptions);
  try {
    await client.connect();
    let db = await client.db(config.dbName);
    console.log("connect to DB Success", config.uri);

    // Core
    _idCol = db.collection("id");
    _fileCol = db.collection("file");
    _accountObjectCol = db.collection("accountObject");
    _eventStoreCol = db.collection("eventStore");
    _integrateLogCol = db.collection("integrateLog");
    _accCommandCol = db.collection("accCommand");
    _commandCol = db.collection("command");

    // Authentication
    _userCol = db.collection("user");

    // Custom
    _articleCol = db.collection("article");
    _commentCol = db.collection("comment");

    dbClient = client;

    cb();
  } catch (e) {
    console.error(e);
  }
}

// Core

const eventStoreCol = function () {
  if (_eventStoreCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _eventStoreCol;
  }
};

const idCol = function () {
  if (_idCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _idCol;
  }
};

const accountObjectCol = function () {
  if (_accountObjectCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _accountObjectCol;
  }
};

const fileCol = function () {
  if (_fileCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _fileCol;
  }
};

const accCommandCol = function () {
  if (_accCommandCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _accCommandCol;
  }
};

const commandCol = function () {
  if (_commandCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _commandCol;
  }
};

// Authentication

const userCol = function () {
  if (_userCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _userCol;
  }
};

// Custom
const articleCol = function () {
  if (_articleCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _articleCol;
  }
};

const commentCol = function () {
  if (_commentCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _commentCol;
  }
};

const getDbClient = function () {
  return dbClient;
};

const integrateLogCol = function () {
  if (_integrateLogCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _integrateLogCol;
  }
};

module.exports = {
  idCol,
  fileCol,
  userCol,
  accountObjectCol,
  commandCol,
  accCommandCol,
  eventStoreCol,
  connectDatabase,
  getDbClient,
  integrateLogCol,
  articleCol,
  commentCol,
};
