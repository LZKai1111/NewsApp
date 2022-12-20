const database = require("../integration/mongodbCloud/database");

async function orderCreated(refCode, actor, payload) {
  let event = {
    type: "orderCreated",
    refCode: refCode,
    actor: actor,
    recorded: new Date(),
    payload: payload,
  };

  return event;
}

async function orderNoteAdded(refCode, actor, data) {
  let event = {
    type: "orderNoteAdded",
    refCode: refCode,
    actor: actor,
    recorded: new Date(),
    payload: {
      note: data.note,
      actionTime: data.actionTime,
    },
  };

  let result = await database.eventStoreCol().insertOne(event);
  return result.ops[0];
}

async function orderCommentAdded(refCode, actor, data) {
  let event = {
    type: "orderCommentAdded",
    refCode: refCode,
    actor: actor,
    recorded: new Date(),
    payload: {
      note: data.note,
      actionTime: data.actionTime,
    },
  };

  let result = await database.eventStoreCol().insertOne(event);
  return result.ops[0];
}

async function loadEventByRefCode(refCode) {
  let options = {
    sort: {
      eventRecorded: -1,
    },
  };
  let result = await database
    .eventStoreCol()
    .find({ code: refCode }, options)
    .toArray();
  return result;
}

async function loadAllEvent(sort, page, recordPerPage) {
  let match = {};

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

  const result = await database.eventStoreCol().aggregate(pipeline).toArray();

  return result[0];
}

module.exports = {
  orderCreated: orderCreated,
  orderNoteAdded: orderNoteAdded,
  orderCommentAdded: orderCommentAdded,

  loadEventByRefCode: loadEventByRefCode,
  loadAllEvent: loadAllEvent,
};
