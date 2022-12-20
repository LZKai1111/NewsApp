const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");

const { loadCommands } = require("./dataModel/commandCol");

const commandLog = require("./eventHttp/log");
const commandCommon = require("./eventHttp/commandCommon");

// Custom command
const commandUpload = require("./eventHttp/commandUpload");
const commandArticle = require("./eventHttp/commandArticle");
const commandComment = require("./eventHttp/commandComment");

const handler = {
  log: require("./controllerCore/log"),
  user: require("./controllerCore/user/index"),
  userSystemAdmin: require("./controllerCore/user/systemAdminActions"),
  authentication: require("./controllerCore/security/authentication"),
  authorization: require("./controllerCore/security/authorization"),
  // Custom controller
  upload: require("./controller/upload"),
  article: require("./controller/article"),
  comment: require("./controller/comment"),

  // Admin

};

const app = express();

const middleware = {
  uploadFile: multer({
    dest: "temp/",
    limits: { fieldSize: 8 * 1024 * 1024 },
  }).single("file"),
  authentication: handler.authentication.userIdentification,
  admin: handler.authentication.adminIdentification,
};

app.use(cors());
app.use(cookieParser());
app.use(express.json());

run(commandLog);
run(commandCommon);
run(commandUpload);
run(commandArticle);
run(commandComment);

app.use(function (req, res, next) {
  if (req.method != "OPTIONS") {
    console.log(req.method, req.url);
    handler.log.requestLog(req);
  }

  const origin = req.headers.origin;
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "token, policy-code, *");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.get('/', (req, res)=>{
  res.status(200);
  res.send("Welcome to root URL of Server");
});

function passCommandName(name) {
  return function (req, res, next) {
    req.commandName = name;
    next();
  };
}

function run(commands) {
  for (let i = 0; i < commands.length; i++) {
    let { command, handlerName, method, endpoint, middlewares } = commands[i];
    if (!command) {
      throw new NotImplementedException();
    }

    let _middlewares = [];

    _middlewares.push(passCommandName(`${handlerName}-${command}`));

    middlewares?.map(function (e) {
      _middlewares.push(middleware[e]);
    });

    if (typeof handler[handlerName][command] === "function") {
      app[method](endpoint, ..._middlewares, handler[handlerName][command]);
    } else {
      console.log(`lack of action ${command} from path ${endpoint}`);
    }
  }
}

async function loadCommandFromDatabase() {
  let systemCommand = await loadCommands();

  run(systemCommand);
}

module.exports = {
  app: app,
  loadCommandFromDatabase: loadCommandFromDatabase,
};
