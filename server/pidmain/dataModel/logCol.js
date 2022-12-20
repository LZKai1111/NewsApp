const database = require("../integration/mongodbCloud/database");

function insertOne(req) {
  var remoteAddress = req.connection.remoteAddress;
  var ip = remoteAddress.split(":")[3];

  let log = {
    customId: req.customId,
    reqHeaders: req.headers,
    originalUrl: req.originalUrl,
    reqBody: req.body,
    reqQuery: req.query,
    reqParams: req.params,
    reqIp: req.ip,
    reqIps: req.ips,
    remoteAddress: remoteAddress,
    reqUser: req.user,
    reqCommandName: req.commandName,
    reqCommand: req.userCommand,

    created: new Date(),
  };

  database.integrateLogCol().insertOne(log, function (err, result) {
    if (err) {
      console.log(err);
    }
  });
}

async function listing(sort, page, recordPerPage, api) {
  let match = {};

  if (api) {
    let regexApi = new RegExp(api);
    console.log(regexApi);
    match["originalUrl"] = { $regex: regexApi, $options: "si" };
  }

  let pipeline = [{ $match: match }];

  let data = [];

  if (page > 1) {
    let skip = (page - 1) * recordPerPage;
    data.push({ $skip: skip });
  }
  data.push({ $limit: recordPerPage });

  let facet = {
    metadata: [
      { $count: "recordTotal" },
      { $addFields: { pageCurrent: page, recordPerPage: recordPerPage } },
    ],
    data: data,
  };

  pipeline.push({ $sort: sort });
  pipeline.push({ $facet: facet });

  const result = await database.integrateLogCol().aggregate(pipeline).toArray();

  return result[0];
}

module.exports = {
  insertOne: insertOne,
  listing: listing,
};
