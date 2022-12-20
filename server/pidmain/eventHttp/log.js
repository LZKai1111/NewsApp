const commands = [
  {
    command: "listing",
    handlerName: "log",
    method: "get",
    endpoint: "/api/v1/admin/log/listing",
    middlewares: ["authentication"],
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
    command: "listingByApi",
    handlerName: "log",
    method: "post",
    endpoint: "/api/v1/admin/log/listing-by-command",
    middlewares: ["authentication"],
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
