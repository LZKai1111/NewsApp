const commands = [
    {
        command: "getAll",
        handlerName: "comment",
        method: "get",
        endpoint: "/api/v1/comment",
        middlerwares: [],
    },
    {
        command: "getArticlecomment",
        handlerName: "comment",
        method: "get",
        endpoint: "/api/v1/articlecomment/:articleCode",
        middlerwares: [],
    },
    {
        command: "getOne",
        handlerName: "comment",
        method: "get",
        endpoint: "/api/v1/comment/:code",
        middlerwares: [],
    },
    {
        command: "create",
        handlerName: "comment",
        method: "post",
        endpoint: "/api/v1/comment",
        middlerwares: ["authentication"],
    },
    {
        command: "update",
        handlerName: "comment",
        method: "patch",
        endpoint: "/api/v1/comment/:code",
        middlerwares: ["authentication"],
    },
    {
        command: "remove",
        handlerName: "comment",
        method: "delete",
        endpoint: "/api/v1/comment/:code",
        middlerwares: ["authentication"],
    },
]

module.exports = commands;