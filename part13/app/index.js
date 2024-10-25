require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const sequelize = new Sequelize(process.env.DATABASE_URL);

const notes = sequelize
  .query("SELECT * FROM blogs", QueryTypes.SELECT)
  .then((data) => {
    console.log("data received is:");
    console.log(JSON.stringify(data, null, 2));
  });

app.listen(3000, () => {
  console.log("listening on port 3000");
});
