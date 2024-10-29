const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("./config");
const { Umzug, SequelizeStorage } = require("umzug");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const migrationConf = {
  migrations: {
    glob: "migrations/*.js",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);

  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("connected to database");
  } catch (err) {
    console.log("Failed to connect to database with error:");
    console.log(err);
    return process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectToDatabase,
  rollbackMigration,
  runMigrations,
};
