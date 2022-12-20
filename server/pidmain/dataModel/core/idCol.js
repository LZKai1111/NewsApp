const database = require("../../integration/mongodbCloud/database");

async function getId(prefix) {
  let time = new Date();
  let counterQuery = { _id: `${prefix}_seq` };
  let counterUpdate = {
    $inc: {
      seq: 1,
    },
    $set: {
      updated: time,
    },
  };
  let options = {
    upsert: true,
    returnOriginal: false,
  };

  try {
    var counter = await database
      .idCol()
      .findOneAndUpdate(counterQuery, counterUpdate, options);
  } catch (e) {
    console.log(e);
  }

  let seq = counter.value.seq.toString();
  // let prefixZero = 6 - seq.length;
  // for (var i = 1; i <= prefixZero; i++) {
  //   seq = `0${seq}`;
  // }

  return `${seq}`;
}

module.exports = {
  getId: getId,
};
