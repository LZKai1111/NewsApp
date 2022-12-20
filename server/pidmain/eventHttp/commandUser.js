const commands = [
  {
    command: "listing",
    handlerName: "accountSystemAdmin",
    method: "get",
    endpoint: "/api/v1/admin/account/listing",
    middlewares: ["authentication"],
    abac: [],
    name: {
      vi: ``,
      en: `Listing user account`,
    },
    des: {
      vi: ``,
      en: `Admin command. Listing all accounts on system`,
    },
  },
  {
    command: "userDetail",
    handlerName: "accountSystemAdmin",
    method: "get",
    endpoint: "/api/v1/admin/account/:userCode/detail",
    middlewares: ["authentication"],
    abac: [],
    name: {
      vi: ``,
      en: `Detail user account`,
    },
    des: {
      vi: ``,
      en: `Admin command. Get detail account info`,
    },
  },

  {
    command: "listUserCommand",
    handlerName: "authorization",
    method: "get",
    endpoint: "/api/v1/admin/user-command",
    middlewares: ["authentication"],
    abac: [],
    name: {
      vi: ``,
      en: `Listing user command`,
    },
    des: {
      vi: ``,
      en: `Admin command. Listing user command on system`,
    },
  },

  {
    command: "addUserCommand",
    handlerName: "authorization",
    method: "post",
    endpoint: "/api/v1/admin/user-command",
    middlewares: ["authentication"],
    abac: [],
    name: {
      vi: ``,
      en: `Add user command`,
    },
    des: {
      vi: ``,
      en: `Admin command. Add user command`,
    },
    validateQuerystring: function () {},
    validateBody: function () {},
    validateParams: function () {
      return function (req, res, rext) {
        if (req.params.userCommandId.length < 8) {
          return res.json({
            errCode: 1,
            errDetail: "xxxxxxx",
            result: {
              reqParams: req.params,
            },
          });
        }

        return next();
      };
    },
  },

  {
    command: "deactiveUserCommand",
    handlerName: "authorization",
    method: "post",
    endpoint: "/api/v1/admin/deactiveUserCommand/:userCommandId",
    middlewares: ["authentication"],
    abac: [],
    name: {
      vi: ``,
      en: `Edit user-command end date`,
    },
    des: {
      vi: ``,
      en: `Admin command. Edit user-command end date`,
    },
    validateQuerystring: function () {},
    validateBody: function () {},
    validateParams: function () {
      return function (req, res, rext) {
        if (req.params.userCommandId.length < 8) {
          return res.json({
            errCode: 1,
            errDetail: "xxxxxxx",
            result: {
              reqParams: req.params,
            },
          });
        }

        return next();
      };
    },
  },
];

module.exports = commands;
