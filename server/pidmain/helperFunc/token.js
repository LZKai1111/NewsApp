const jwt = require("jsonwebtoken");
const config = require('../config/app.json')


function createToken(payload) {
  var options = {
    //expiresInMinutes: 123456
  };
  var token = jwt.sign(payload, config.tokenSecret, options);
  return token;
}

function decodeToken(token, cb){
  try {
    var payload = jwt.verify(token, config.tokenSecret);
  } catch(err) {
    return cb(err);
  }
  return cb(null, payload);
}

function syncDecodeToken(token){
  return jwt.verify(token, config.tokenSecret);
}

module.exports = {
  createToken: createToken,
  decodeToken: decodeToken,
  syncDecodeToken: syncDecodeToken
}

function run(payload) {
  var options = {
    //expiresInMinutes: 123456
  };
  var token = jwt.sign(payload, config.tokenSecret, options);
  console.log(payload)
  console.log(token)
}

let data = {username: '8717'}


