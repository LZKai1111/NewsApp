const bcrypt = require("bcrypt");
const database = require("../../integration/mongodbCloud/database");
const tokenUtil = require("../../helperFunc/token");
const { jsonResponse } = require("../../helperFunc/handle");
const { USER_STATUS } = require("../../dataModel/core/userCol");

async function login(req, res) {
  let body = req.body;
  if (!body.email) {
    return res.json({
      errCode: "emailParams",
      errDetail: "Email required",
      result: {
        reqBody: body,
      },
    });
  }
  body.email = body.email.toLowerCase();
  let user = await database.userCol().findOne({ email: body.email });
  if (!user) {
    return res.json({
      errCode: "emailParams",
      errDetail: "Email not found",
      result: {
        reqBody: body,
      },
    });
  }

  const match = await bcrypt.compare(body.password, user.passwordHash);

  if (!match) {
    return res.json({
      errCode: "passwordParams",
      errDetail: "Password incorrect",
      result: {
        reqBody: body,
      },
    });
  }

  if (!user.emailVerify) {
    const response = {
      code: user.code,
      email: user.email,
    };
    return res.json(jsonResponse(response, "verify", "Please verify your email"));
  }

  if (!user.token) {
    let tokenPayload = {
      code: user.code,
      email: user.email,
    };

    user["token"] = tokenUtil.createToken(tokenPayload);
  }

  if (user.status && user.status === "freeze") {
    return res.json({
      errCode: "emailParams",
      errDetail: "Your account is frozen",
      result: {
        reqBody: body,
      },
    });
  }
  delete user.passwordHash;
  delete user.passwordPrevious;
  return res.json(jsonResponse({
    account: user,
  }));
}

async function userIdentification(req, res, next) {
  let token = req.headers["token"];

  if (!token) {
    return res.json({
      errCode: 1,
      errDetail: {
        en: "authentication fail",
      },
      result: {
        reqHeaders: req.headers,
      },
    });
  }

  try {
    var payload = tokenUtil.syncDecodeToken(token);
  } catch (e) {
    res.status(401);
    return res.json({
      errCode: 1,
      errDetail: "jwt malformed",
      result: {
        tokenPayload: payload,
      },
    });
  }

  if (!payload || !payload.code) {
    return res.json({
      errCode: 1,
      errDetail: {
        en: "authentication fail",
      },
      result: {
        tokenPayload: payload,
      },
    });
  }

  let account = [];
  account = await database.userCol().find({ code: payload.code }).toArray();

  if (account.length == 0 || account.length > 1) {
    res.status(401);
    return res.json({
      errCode: 1,
      errDetail: "account not found",
      result: {
        tokenPayload: payload,
      },
    });
  }

  if (account[0].status && account[0].status === USER_STATUS.FREEZE) {
    res.status(401);
    return res.json({
      errCode: 1,
      errDetail: "Your account is frozen",
      result: {
        tokenPayload: payload,
      },
    });
  }

  req.user = {
    code: account[0].code,
    email: account[0].email,
    firstName: account[0].firstName,
    lastName: account[0].lastName,
    inviteMax: account[0].inviteMax ?? 10,
  };

  return next();
}

async function adminIdentification(req, res, next) {
  let token = req.headers["token"];

  if (!token) {
    return res.json({
      errCode: 1,
      errDetail: {
        en: "authentication fail",
      },
      result: {
        reqHeaders: req.headers,
      },
    });
  }

  try {
    var payload = tokenUtil.syncDecodeToken(token);
  } catch (e) {
    res.status(401);
    return res.json({
      errCode: 1,
      errDetail: "jwt malformed",
      result: {
        tokenPayload: payload,
      },
    });
  }

  if (!payload || !payload.code) {
    return res.json({
      errCode: 1,
      errDetail: {
        en: "authentication fail",
      },
      result: {
        tokenPayload: payload,
      },
    });
  }

  let account = [];
  account = await database.userCol().find({ code: payload.code, userRole: "admin" }).toArray();

  if (account.length == 0 || account.length > 1) {
    res.status(401);
    return res.json({
      errCode: 1,
      errDetail: "account not found",
      result: {
        tokenPayload: payload,
      },
    });
  }

  req.user = (({ code, email }) => ({ code, email }))(account[0]);

  return next();
}

module.exports = {
  login: login,
  userIdentification: userIdentification,
  adminIdentification: adminIdentification,
};
