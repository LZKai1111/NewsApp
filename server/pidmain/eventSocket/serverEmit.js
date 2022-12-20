var io;
function index(socket){
	conv.memberIds.map(function(memberId){
    if(_socketTree[memberId]){
      Object.keys(_socketTree[memberId]).forEach(function (socketId) {
        _socketTree[memberId][socketId].emit('message', msg, (data) => {
          console.log(data); // data will be 'woot'
        });
      })
    }
  })
}

function initIo(ioInit) {
  io = ioInit;
}
function authenticationError(socket) {
  socket?.emit("error", {
    code: "AUTHENTICATION_ERROR",
    message: "Authentication error",
  });
}

function emitError(socket, message) {
  socket?.emit("error", message);
}

function ioEmitToRoom(roomId, message, data) {
  io?.to(roomId).emit(message, data);
}

module.exports = {
	index,
  initIo,
  authenticationError,
  emitError,
  ioEmitToRoom,
}