require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL;
const SECRET = process.env.SECRET;

module.exports = { DATABASE_URL, SECRET };
