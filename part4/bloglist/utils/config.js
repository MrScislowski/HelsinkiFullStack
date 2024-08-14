require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_URI_TEST
  : process.env.NODE_ENV === 'development'
  ? process.env.MONGODB_URI_DEV
  : process.env.MONGODB_URI

const SECRET = process.env.SECRET

const config = { PORT, MONGODB_URI, SECRET }

module.exports = config