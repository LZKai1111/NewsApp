const database = require("../../integration/mongodbCloud/database");

const USER_STATUS = {
  ACTIVE: "active",
  FREEZE: "freeze",
};

async function create(data, session) {
  // Create User
  let user = {
    code: data.code,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    passwordPrevious: data.passwordPrevious,
    passwordHash: data.passwordHash,
    userRole: data.userRole,
    emailVerify: data.emailVerify,
    emailVerifyCode: data.emailVerifyCode,
    verifyExpiredAt: data.verifyExpiredAt,
    status: USER_STATUS.ACTIVE,
    createdAt: new Date(),
    token: data.token
  };

  let result = await database.userCol().insertOne(user, session);
  return result.ops[0];
}

async function getToken(){
  const accounts = await database.userCol().find().toArray();
  return accounts;
}

async function update(code, account) {
  account["updatedAt"] = new Date();
  let result = await database
    .userCol()
    .findOneAndUpdate({ code: code }, { $set: account });

  return result.value;
}

async function loadUserWithCodeList(codes, projection) {
  let query = {
    code: {
      $in: codes,
    },
    deletedAt: null,
  };

  let options = {
    projection: projection,
  };

  return database.userCol().find(query, options).toArray();
}

async function getOne(userCode) {
  return database.userCol().findOne({ code: userCode });
}

function destroy(code) {
  database.userCol().updateOne(
    { code },
    {
      $set: {
        deletedAt: new Date(),
      },
    }
  );
}

async function uploadAvatar(code, avatar) {
  let result = await database.userCol().findOneAndUpdate(
    { code: code },
    {
      $set: { avatar },
    }
  );

  return result.value;
}

async function findByEmail(email) {
  return database.userCol().findOne({ email });
}

async function verifyEmail(code) {
  let result = await database.userCol().findOneAndUpdate(
    { code: code },
    {
      $set: {
        emailVerify: true,
        emailVerifyCode: null,
        verifyExpiredAt: null,
      },
    }
  );

  return result.value;
}

async function findByNameWithRegex(codes, search) {
  const match = { code: { $in: codes } };
  const pipeline = [{ $match: match }];
  pipeline.push({
    $addFields: {
      name: {
        $concat: ["$firstName", " ", "$lastName"],
      },
    },
  });
  pipeline.push({
    $match: {
      name: new RegExp(search, "i"),
    },
  });
  pipeline.push({
    $project: {
      code: 1,
    },
  });
  const result = await database.userCol().aggregate(pipeline).toArray();

  return result;
}

async function findUserByNameWithRegex(search) {
  const pipeline = [];
  pipeline.push({
    $addFields: {
      name: {
        $concat: ["$firstName", " ", "$lastName"],
      },
    },
  });
  pipeline.push({
    $match: {
      name: new RegExp(search, "i"),
    },
  });
  pipeline.push({
    $project: {
      code: 1,
    },
  });
  const result = await database.userCol().aggregate(pipeline).toArray();

  return result;
}

async function updateTempPassword(code, password) {
  let result = await database.userCol().findOneAndUpdate(
    { code: code },
    {
      $set: {
        tempPassword: password,
      },
    }
  );

  return result.value;
}

async function updatePassword(code, passwordHash, passwordPrevious) {
  let result = await database.userCol().findOneAndUpdate(
    { code: code },
    {
      $set: {
        tempPassword: null,
        passwordHash,
        passwordPrevious,
      },
    }
  );

  return result.value;
}

module.exports = {
  create,
  update,
  getOne,
  destroy,
  loadUserWithCodeList,
  uploadAvatar,
  findByEmail,
  verifyEmail,
  findByNameWithRegex,
  updateTempPassword,
  updatePassword,
  findUserByNameWithRegex,
  USER_STATUS,
  getToken,
};
