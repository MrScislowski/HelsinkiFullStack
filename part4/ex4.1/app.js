const express = require('express')
const app = express()
const cors = require('cors')
const { DB_URL } = require('./utils/config')
const Blog = require('./models/blog')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(express.json())

mongoose.connect(DB_URL)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(middleware.tokenExtractor)
app.use('/api/blogs', require('./controllers/blogs'))
app.use('/api/users', require('./controllers/users'))
app.use('/api/login', require('./controllers/login'))

module.exports = app