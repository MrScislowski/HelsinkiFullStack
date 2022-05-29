require('dotenv').config()
const { response } = require('express')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note')


const app = express()

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

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    Note.findById(id).then(returnedNote => {
        response.json(returnedNote)
    })
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...note.map(n => n.id))
    : 0

    return maxId + 1
}

app.post('/api/notes', (req, res) => {
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
    
    note.save().then(savedNote => {
        res.json(savedNote)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})