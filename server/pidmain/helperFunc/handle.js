const nanoid = require("nanoid");
const moment = require("moment");

function hideUserProtectData(user) {
  if (!user) return user;
  delete user.verifyExpiredAt;
  delete user.emailVerifyCode;
  delete user.passwordPrevious;
  delete user.passwordHash;
  delete user._id;
  return user;
}

function hideUserInfo(item) {
  if (!item?.user) return item;
  item.user = hideUserProtectData(item.user);
  return item;
}

function hideUserInfoArray(data) {
  return data.map((item) => hideUserInfo(item));
}

function jsonResponse(result, code = null, error = null) {
  return {
    errCode: code,
    errDetail: !error && code ? result : error,
    result,
  };
}

function dataPagination(match, sort, page = 1, limit = 10, join = false) {
  const aggregate = [{ $match: match }];
  let data = [];
  
  data.push({ $sort: sort });
  if (page > 1) {
    let skip = (page - 1) * limit;
    data.push({ $skip: skip });
  }
  data.push({ $limit: limit });
  if (join) {
    join.forEach((item) => data.push(item));
  }
  let facet = {
    metadata: [
      { $count: "recordTotal" },
      { $addFields: { pageCurrent: page, recordPerPage: limit } },
    ],
    data: data,
  };

  aggregate.push({ $facet: facet });
  return aggregate;
}

function handlePagination(data) {
  if (data.metadata && data.metadata.length > 0) {
    data.metadata = data.metadata[0];
  }
  if (!data.metadata || data.metadata.length === 0) {
    data.metadata = false;
  }
  return data;
}

function randomStringCustom(size = 16) {
  const result = nanoid.customAlphabet(
    "1234567890abcdefghijklmnopqrstuvwxyz",
    size
  );
  return result();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function validateData(data, rules) {
  for (let rule of rules) {
    if (!data[rule]) {
      return rule;
    }
  }
  return false;
}

function getUserName(user) {
  return user.firstName + " " + user.lastName;
}

function isAskCode(code) {
  if (code.includes("RR-CHAT")) {
    return true;
  }
  return false;
}

function isAskEnd(ask) {
  if (ask.isEnd) return true;
  if (!ask.endAt) return false;
  if (moment(ask.endAt).utc().isBefore(moment().utc())) return true;
  return false;
}

function fileContentType(fileName) {
  const ext = fileName.split('.').filter(Boolean).slice(-1)[0];
  switch (ext) {
    case 'jpeg' || 'jpg': 
      return 'image/jpeg';
    case 'png': 
      return 'image/png';
    case 'gif': 
      return 'image/gif';
    case 'svg': 
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

module.exports = {
  hideUserProtectData,
  hideUserInfo,
  hideUserInfoArray,
  jsonResponse,
  dataPagination,
  getRandomInt,
  validateData,
  randomStringCustom,
  handlePagination,
  getUserName,
  isAskCode,
  isAskEnd,
  fileContentType,
};
