const { v4: uuidv4 } = require("uuid");

const logCol = require("../dataModel/logCol");

const defaultPage = 1;
const defaultRecordPerPage = 20;

function requestLog(req) {
  if (!req.customId) {
    req["customId"] = uuidv4();
  }

  logCol.insertOne(req);
}

async function listing(req, res) {
  let page = defaultPage;
  let recordPerPage = defaultRecordPerPage;

  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  if (req.query.limit) {
    recordPerPage = parseInt(req.query.limit);
  }

  var sort = {
    created: -1,
  };

  let result = await logCol.listing(sort, page, recordPerPage);
  return res.json({
    errCode: null,
    errDetail: {
      vi: "",
    },
    result: result,
  });
}

async function listingByApi(req, res) {
  let page = defaultPage;
  let recordPerPage = defaultRecordPerPage;

  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  if (req.query.limit) {
    recordPerPage = parseInt(req.query.limit);
  }

  var sort = {
    created: -1,
  };

  let api = req.body.api;
  let regexApi = null;
  switch (api) {
    case "/api/v1/admin/location-service/listing":
      regexApi = "/api/v1/admin/location-service/listing.*";
      break;
    case "/api/v1/admin/location-service/:locsvcId/detail":
      regexApi = "/api/v1/admin/location-service/.*/detail";
      break;
    default:
      regexApi = api;
  }

  let result = await logCol.listing(sort, page, recordPerPage, regexApi);
  return res.json({
    errCode: null,
    errDetail: {
      vi: "",
    },
    result: result,
  });
}

module.exports = {
  requestLog: requestLog,
  listing: listing,
  listingByApi: listingByApi,
};
