const mongoose = require('mongoose')
const { DB_URL } = require('../utils/config')

mongoose.connect(DB_URL)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = mongoose.model('Blog', blogSchema)