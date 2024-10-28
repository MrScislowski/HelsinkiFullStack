const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("./config");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("connected to database");
  } catch (err) {
    console.log("Failed to connect to database with error:");
    console.log(err);
    return process.exit(1);
  }
};

module.exports = { sequelize, connectToDatabase };
