const database = require("../../integration/mongodbCloud/database");

let listObjectType = ["locationService", "physicalProduct", "merchant"];

async function insertOne(
  account,
  objectData,
  objectType,
  start,
  end,
  createBy
) {
  if (!listObjectType.includes(objectType)) {
    var err = new Error("objectType invalid");
    throw err;
  }

  let record = {
    userCode: account.code,
    userEmail: account.email,
    userPhone: account.phone,
    user: account,
    objectType: objectType,
    object: objectData,
    objectCode: objectData.code,
    rejected: null,
    start: start,
    end: end,
    created: new Date(),
    createBy: createBy,

    role: "admin",
    dataReadable: [],
    dataWriteable: [],
  };

  let result = await database.accountObjectCol().insertOne(record);
  return result.ops[0];
}

async function loadResourceGroupByUser(listUserCode) {
  let pipeline = [];

  if (listUserCode) {
    let match = {
      userCode: {
        $in: listUserCode,
      },
    };

    pipeline.push({ $match: match });
  }

  let groupByUserCode = {
    _id: "$userCode",
    resources: { $push: "$$ROOT" },
  };
  pipeline.push({ $group: groupByUserCode });

  const result = await database
    .accountObjectCol()
    .aggregate(pipeline)
    .toArray();
  return result[0];
}

async function findByRelation(userCode, objectCode) {
  const query = {
    userCode: userCode,
    objectCode: objectCode,
  };

  let result = await database.accountObjectCol().findOne(query);
  return result;
}

async function loadResourceByUserAndType(userCode, objectType) {
  const query = {
    userCode: userCode,
    objectType: objectType,
    rejected: null,
  };

  const options = {
    projection: {
      objectCode: 1,
    },
  };

  let result = await database.accountObjectCol().find(query, options).toArray();
  result = result.map((e) => e.objectCode);
  return result;
}

module.exports = {
  insertOne: insertOne,
  loadResourceGroupByUser: loadResourceGroupByUser,
  findByRelation: findByRelation,
  loadResourceByUserAndType: loadResourceByUserAndType,
};
