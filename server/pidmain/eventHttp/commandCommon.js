const commands = [
  {
    command: "register",
    handlerName: "user",
    method: "post",
    endpoint: "/api/v1/user/register",
    abac: [],
    name: {
      vi: ``,
      en: ``,
    },
    des: {
      vi: ``,
      en: ``,
    },
  },
  {
    command: "getToken",
    handlerName: "user",
    method: "get",
    endpoint: "/api/v1/usertoken",
    middlewares: [],
  },
  {
    command: "emailVerify",
    handlerName: "user",
    method: "post",
    endpoint: "/api/v1/user/verify",
    abac: [],
    name: {
      vi: ``,
      en: ``,
    },
    des: {
      vi: ``,
      en: ``,
    },
  },
  {
    command: "resendEmailVerify",
    handlerName: "user",
    method: "post",
    endpoint: "/api/v1/user/verify/resend",
    abac: [],
    name: {
      vi: ``,
      en: ``,
    },
    des: {
      vi: ``,
      en: ``,
    },
  },
  {
    command: "login",
    handlerName: "authentication",
    method: "post",
    endpoint: "/api/v1/user/login",
    abac: [],
    name: {
      vi: ``,
      en: ``,
    },
    des: {
      vi: ``,
      en: ``,
    },
  },
  {
    command: "forgotPassword",
    handlerName: "user",
    method: "post",
    endpoint: "/api/v1/user/forgot-password",
    abac: [],
    name: {
      vi: ``,
      en: ``,
    },
    des: {
      vi: ``,
      en: ``,
    },
  },
  {
    command: "verifyForgotPassword",
    handlerName: "user",
    method: "post",
    endpoint: "/api/v1/user/forgot-password/verify",
    abac: [],
    name: {
      vi: ``,
      en: ``,
    },
    des: {
      vi: ``,
      en: ``,
    },
  },
];

module.exports = commands;
