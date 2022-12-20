const database = require("../../integration/mongodbCloud/database");
const userCol = require("../../dataModel/core/userCol");
const accCommandCol = require("../../dataModel/core/accCommandCol");
const accObjectRelCol = require("../../dataModel/core/accObjRelCol");

async function listing(req, res) {
  let result = await userCol.listingUser();
  return res.json({
    errCode: null,
    errDetail: null,
    result: {
      data: result,
    },
  });
}

async function userDetail(req, res) {
  let user = await userCol.loadUserWithCodeList([req.params.userCode]);
  let commands = await accCommandCol.loadCommandGroupByUser([
    req.params.userCode,
  ]);
  let resources = await accObjectRelCol.loadResourceGroupByUser([
    req.params.userCode,
  ]);
  return res.json({
    errCode: null,
    errDetail: null,
    result: {
      user: user,
      commands: commands,
      resources: resources,
    },
  });
}

async function profile(req, res) {
  let user = await database.userCol().findOne({ code: req.user.code });

  return res.json({
    errCode: null,
    errDetail: null,
    result: {
      user: user,
      menu: [
        { flight: true },
        { locsvc: true },
        { order: true },
        { user: true },
        { policy: true },
        { merchant: true },
        { command: true },
        { systemEvent: true },
        { userEvent: true },
        { log: true },
        { integration: true },
      ],
      lang: "en",
    },
  });
}

module.exports = {
  listing: listing,
  userDetail: userDetail,
  profile: profile,
};
