const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})


const { response } = require('express')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note')


// const app = express()

app.use(express.json())
app.use(cors())




app.get('/', (request, response) => {
    response.send('<h1>hello world! </h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
    response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    const id = Number(request.params.id)
    Note.findById(id)
    .then(returnedNote => {
        if (returnedNote) {
            response.json(returnedNote)
        } else {
            response.status(404).end()
        }  
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (req, res) => {
    Note.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response) => {
    const {content, important} = request.body
    
    Note.findByIdAndUpdate(
        req.params.id, 
        { content, important }, 
        { new: true, runValidators: true, context: 'query' } )
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...note.map(n => n.id))
    : 0

    return maxId + 1
}

app.post('/api/notes', (req, res, next) => {
    const body = req.body

    if (!body.content) {
        return res.status(400).json( {
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })
    
    note.save()
        .then(savedNote => {
            res.json(savedNote)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformed id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    
    next(error)
}

app.use(errorHandler)