const bcrypt = require("bcrypt");
const database = require("../../integration/mongodbCloud/database");
const userCol = require("../../dataModel/core/userCol");
const idCol = require("../../dataModel/core/idCol");
const tokenUtil = require("../../helperFunc/token");
const moment = require("moment");
const { jsonResponse } = require("../../helperFunc/handle");

const saltRounds = 10;

let registerQueue = [];
let lock = false;

async function register(req, res) {
  if (!req.body.email || !req.body.password) {
    return res.json(jsonResponse("Email and password is required", "email"));
  }

  if (req.body.password != req.body.password_confirmation) {
    return res.json(
      jsonResponse("Password confirm is required", "password_confirmation")
    );
  }

  if (req.body.password.length < 6) {
    return res.json(jsonResponse("Password minimum is 6", "password"));
  }

  try {
    var email = req.body.email.toLowerCase();
  } catch (err) {
    return res.json(jsonResponse("Email is required", "email"));
  }

  try {
    var user = await database.userCol().findOne({
      email: email, status: {
      $ne: "freeze"
    } });
  } catch (e) {
    return res.json(jsonResponse("System error", "email"));
  }

  if (user) {
    return res.json(jsonResponse("User with email existed", "email"));
  }

  registerQueue.push({
    req: req,
    res: res,
  });

  if (lock === false) {
    takeRequest();
  }
}

let request = null;
function takeRequest() {
  request = registerQueue.shift();

  if (request) {
    lock = true;
    processQueue(request.req, request.res);
  } else {
    lock = false;
  }
}

async function processQueue(req, res) {
  let body = req.body;
  body.email = body.email.toLowerCase();
  let code = await idCol.getId("user");
  try {
    var passwordHash = await bcrypt.hash(body.password, saltRounds);
  } catch (e) {
    lock = false;
    takeRequest();
    return console.log(e);
  }

  const tokenPayload = {
    code: code,
    email: body.email,
  };
  var user = await database.userCol().findOne({ email: body.email });
  if (user) {
    lock = false;
    takeRequest();
    return res.json(jsonResponse("User with email existed", "email"));
  }

  const account = {
    code: code,
    emailVerify: true,
    emailVerifyCode: "",
    verifyExpiredAt: null,
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    userRole: "user",
    passwordPrevious: body.passwordRandom ? body.passwordRandom : null,
    passwordHash: passwordHash,
    token: tokenUtil.createToken(tokenPayload),
  };

  const client = database.getDbClient();
  const session = client.startSession();

  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  var newUser = null;
  const registerOptions = {
    session,
  };

  try {
    const transactionResults = await session.withTransaction(async () => {
      newUser = await userCol.create(account, registerOptions);
    }, transactionOptions);

    if (transactionResults) {
      console.log("transactionResults successfully created.");
    } else {
      console.log("transactionResults intentionally aborted.");
    }
  } catch (e) {
    console.log("The transaction was aborted due to an unexpected error: " + e);
    lock = false;
    takeRequest();
    return res.json(jsonResponse("System error", "email"));
  } finally {
    await session.endSession();
    lock = false;
  }

  
  delete newUser.passwordHash;
  delete newUser.token;
  delete newUser.emailVerifyCode;

  res.json(jsonResponse(newUser));
  takeRequest();
}

async function emailVerify(req, res) {
  if (!req.body.email || !req.body.code) {
    return res.json(jsonResponse("Request invalid", "email"));
  }

  try {
    const email = req.body.email.toLowerCase();
    const user = await database.userCol().findOne({ email });
    if (!user) {
      return res.json(jsonResponse("User not found", "email"));
    }
    if (user.emailVerifyCode.toString() !== req.body.code) {
      return res.json(jsonResponse("Verify code invalid", "code"));
    }
    const updated = await userCol.verifyEmail(user.code);
    if (!updated) {
      return res.json(jsonResponse("Verify user fail", "email"));
    }
    res.json(jsonResponse({ emailVerify: true }));
  } catch (e) {
    console.log(e);
    return res.json(jsonResponse("System error", 1));
  }
}

async function resendEmailVerify(req, res) {
  const body = req.body;
  if (!body.email) {
    return res.json(jsonResponse("Request invalid", "email"));
  }

  try {
    const email = body.email.toLowerCase();
    const user = await database.userCol().findOne({ email });
    if (!user) {
      return res.json(jsonResponse("User not found", "email"));
    }
    if (user.verifyEmail) {
      return res.json(jsonResponse("User already verified", "code"));
    }
    const momentVerifyExpiredAt = moment(user.verifyExpiredAt).utc();
    if (momentVerifyExpiredAt.isAfter(moment().utc())) {
      return res.json(
        jsonResponse("Delay for send email", "delay", user.verifyExpiredAt)
      );
    }
    const emailVerifyCode = getRandomInt(100000, 999999);
    const verifyExpiredAt = moment().utc().add(4, "minutes").toDate();
    const sendEmailVerify = sendEmail(
      body.email,
      user.firstName,
      emailVerifyCode
    );
    if (!sendEmailVerify) {
      return res.json(jsonResponse("Send email fail", "email"));
    }
    const updated = await userCol.update(user.code, {
      emailVerifyCode,
      verifyExpiredAt,
    });
    if (!updated) {
      return res.json(jsonResponse("Update user fail", "email"));
    }
    res.json(jsonResponse({ verifyExpiredAt }));
  } catch (e) {
    console.log(e);
    return res.json(jsonResponse("System error", 1));
  }
}

async function forgotPassword(req, res) {
  const body = req.body;
  if (!body.email) {
    return res.json(jsonResponse("Request invalid", "email"));
  }

  try {
    const email = body.email.toLowerCase();
    const user = await database.userCol().findOne({ email });
    if (!user) {
      return res.json(jsonResponse("User not found", "email"));
    }
    const tempPassword = randomStringCustom(8);
    const updated = await userCol.updateTempPassword(user.code, tempPassword);
    if (!updated) {
      return res.json(jsonResponse("Update temp password fail", "email"));
    }
    try {
      const message = {
        subject: "Forgot Password",
        text: false,
        html: `Hi <b>${user.firstName}</b>,<br />
        <p>Your recovery password is <b>${tempPassword}</b></p>`,
      };
      // Send email
      // awsMail.sendEmail(email, message);
    } catch (error) {
      console.log(error);
      return res.json(jsonResponse("Send email fail", "email"));
    }
    res.json(jsonResponse({ status: true }));
  } catch (e) {
    console.log(e);
    return res.json(jsonResponse("System error", 1));
  }
}

async function verifyForgotPassword(req, res) {
  const body = req.body;
  if (!body.email) {
    return res.json(jsonResponse("Request invalid", "email"));
  }
  if (!body.tempPassword) {
    return res.json(jsonResponse("Request invalid", "tempPassword"));
  }

  try {
    const email = body.email.toLowerCase();
    const user = await database.userCol().findOne({ email });
    if (!user) {
      return res.json(jsonResponse("User not found", "email"));
    }
    if (user.tempPassword != body.tempPassword) {
      return res.json(jsonResponse("Wrong recovery password", "tempPassword"));
    }
    if (!body.password || !body.confirmPassword) {
      return res.json(jsonResponse({ tempPassword: true }));
    }
    if (body.password != body.confirmPassword) {
      return res.json(
        jsonResponse("Wrong password confirm", "confirmPassword")
      );
    }
    if (body.password.length < 6) {
      return res.json(jsonResponse("Password minimum is 6", "password"));
    }
    try {
      var passwordHash = await bcrypt.hash(body.password, saltRounds);
    } catch (e) {
      return console.log(e);
    }
    const updated = await userCol.updatePassword(
      user.code,
      passwordHash,
      user.passwordHash
    );
    if (!updated) {
      return res.json(jsonResponse("Update password fail", "email"));
    }
    res.json(jsonResponse({ status: true }));
  } catch (e) {
    console.log(e);
    return res.json(jsonResponse("System error", 1));
  }

}

async function getToken(req, res){
  const data = await userCol.getToken();
  return res.json(data);
}

module.exports = {
  register,
  emailVerify,
  resendEmailVerify,
  forgotPassword,
  verifyForgotPassword,
  getToken,
};
