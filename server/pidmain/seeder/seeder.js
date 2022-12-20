const database = require("../integration/mongodbCloud/database");

database.connectDatabase(async function () {
  migrateData();
});

async function migrateData() {
  // Run migration code here

  console.log("ok");
}
