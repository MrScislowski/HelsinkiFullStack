require("dotenv").config();

const PORT = process.env.PORT;
let DB_URL = "";
switch (process.env.NODE_ENV) {
  //   case 'test':
  //     DB_URL = process.env.TEST_DB_URL
  //     break
  //   case 'offline':
  //     DB_URL = process.env.OFFLINE_DB_URL
  //     break
  //   case 'production':
  //     DB_URL = process.env.DB_URL
  //     break
  default:
    DB_URL = process.env.DB_URL;
}
module.exports = {
  PORT,
  DB_URL,
};
