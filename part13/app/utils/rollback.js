const { rollbackMigration, sequelize } = require("./db");

rollbackMigration()
  .then(() => sequelize.close())
  .then(() => console.log("done"));
