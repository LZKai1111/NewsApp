const commands = [
  {
    command: "uploadImage",
    handlerName: "upload",
    method: "post",
    endpoint: "/api/v1/upload-image",
    middlewares: ["authentication", "uploadFile"],
  },
  {
    command: "downloadImage",
    handlerName: "upload",
    method: "get",
    endpoint: "/api/v1/download-image",
    middlewares: [],
  },
];

module.exports = commands;
