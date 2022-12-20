
const tokenUtil = require("../helperFunc/token");
const { authenticationError, emitError, ioEmitToRoom } = require("./serverEmit");

function checkUser(socket) {
  try {
    const token = socket.handshake.headers.token;
    const payload = tokenUtil.syncDecodeToken(token);
    return payload;
  } catch (err) {
    console.log(err);
    authenticationError(socket);
    socket.disconnect();
    return false;
  }
}

function index(socket) {
  socket.on("chatInit", async function (data) {
    const userInfo = checkUser(socket);
    if (!userInfo) {
      return authenticationError(socket);
    }
    console.log(`chat-${userInfo.code}`);
    socket.join(`chat-${userInfo.code}`);
  });

	socket.on("joinRoom", async function (data) {
    socket.join(data.chatCode);
    ioEmitToRoom(data.chatCode, 'userJoin', userInfo);
  });

  socket.on("leftRoom", async function (data) {
    const userInfo = checkUser(socket);
    if (!userInfo) {
      return authenticationError(socket);
    }
    if (!data.chatCode) {
      return emitError(socket, {
        code: "CHAT_CODE",
        message: "Chat code required",
      });
    }
    socket.leave(data.chatCode);
    ioEmitToRoom(data.chatCode, 'userLeft', userInfo);
  });

  socket.on("typing", function (data) {
    const userInfo = checkUser(socket);
    if (!userInfo) {
      return authenticationError(socket);
    }
    if (!data.chatCode) {
      return emitError(socket, {
        code: "CHAT_CODE",
        message: "Chat code required",
      });
    }
    ioEmitToRoom(data.chatCode, 'newMessage', {
      ...data,
      ...userInfo,
    });
  });

  socket.on("stopTyping", function (data) {
    const userInfo = checkUser(socket);
    if (!userInfo) {
      return authenticationError(socket);
    }
    if (!data.chatCode) {
      return emitError(socket, {
        code: "CHAT_CODE",
        message: "Chat code required",
      });
    }
    ioEmitToRoom(data.chatCode, 'stopTyping', {
      ...data,
      ...userInfo,
    });
  });
}

module.exports = {
	index: index
}