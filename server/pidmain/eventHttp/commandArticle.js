const commands = [
    {
        command: "getAll",
        handlerName: "article",
        method: "get",
        endpoint: "/api/v1/article",
        middlewares: [],
    },
    {
        command: "getByAdmin",
        handlerName: "article",
        method: "get",
        endpoint: "/api/v1/adminarticle",
        middlewares: ["authentication"],
    },
    {
        command: "getOne",
        handlerName: "article",
        method: "get",
        endpoint: "/api/v1/article/:code",
        middlewares: [],
    },
    {
        command: "create",
        handlerName: "article",
        method: "post",
        endpoint: "/api/v1/admin/article",
        middlewares: ["admin"],
    },
    {
        command: "update",
        handlerName: "article",
        method: "patch",
        endpoint: "/api/v1/admin/article/:code",
        middlewares: ["admin"],
    },
    {
        command: "remove",
        handlerName: "article",
        method: "delete",
        endpoint: "/api/v1/admin/article/:code",
        middlewares: ["admin"],
    },
];

module.exports = commands;