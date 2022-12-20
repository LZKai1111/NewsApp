const fs = require("fs");

const expressApp = require("./route");
const config = require("./config/app");
const cronJob = require("./cron");
const database = require("./integration/mongodbCloud/database");
const socketServerListen = require("./eventSocket/serverListen");
const socketServerEmit = require("./eventSocket/serverEmit");

database.connectDatabase(async function () {
  startServer();
  cronJob.start();
});
var server
function startServer() {
  if (process.env.NODE_ENV === "production") {
    const https_options = {
      key: fs.readFileSync(config.ssl.key),
      cert: fs.readFileSync(config.ssl.cert),
    };
    server = require("https").Server(https_options, expressApp.app);

    server.listen(443, () => {
      console.log("App is listening at port", 443);
    });
  } else {
    server = require("http").Server(expressApp.app);

    server.listen(3001, () => {
      console.log("App is listening at port", 3001);
    });
  }
  startSocket();
}

/**
 * Start Express server.
 */

// Socket
var socketTree = {};
var io;
function startSocket() {
  io = require("socket.io")(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    socketServerListen.index(socket);
    socketServerEmit.initIo(io);
  
    socket.on("disconnect", (reason) => {
      Object.keys(socketTree).forEach(function (userId) {
        if (socketTree[userId][socket.id]) {
          delete socketTree[userId][socket.id];
  
          if (Object.keys(socketTree[userId]).length < 1) {
            delete socketTree[userId];
            socket.broadcast.emit("online", Object.keys(socketTree));
          }
        }
      });
    });
  });  
}