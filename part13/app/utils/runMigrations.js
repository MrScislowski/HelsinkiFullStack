const { runMigrations, sequelize } = require("./db");

runMigrations()
  .then(() => sequelize.close())
  .then(() => console.log("done"));
