require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Entry = require('./models/entry')

app.use(express.json())
app.use(express.static('build'))

const customMorgan = (tokens, req, res) => {
    const postBody = (tokens.method(req, res) === "POST")
        ? JSON.stringify(req.body)
        : ""
    
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), 
        '-',
        tokens["response-time"](req, res),
        'ms',
        postBody
    ].join(' ')
}

app.use(morgan(customMorgan))

app.get('/api/persons', (req, res, next) => {
    Entry.find({})
        .then(result => {
            res.json(result)
    })
        .catch(error => {
            next(error)
        })
})

app.get('/info', (req, res) => {
    const phonebookInfo = `Phonebook has info for ${persons.length} people`
    const dateInfo = new Date().toString()
    res.send(`${phonebookInfo}<br>${dateInfo}`)
})

app.get('/api/persons/:id', (req, res, next) => {
    Entry.findById(req.params.id)
        .then(entry => {
            if (note) {
                res.json(entry)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Entry.findByIdAndRemove(req.params.id)
        .then(response => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// creating new entries
app.post('/api/persons', (req, res, next) => {
    const {name, number} = req.body

    // if (!name) {
    //     return res.status(400).json({error: "name is missing"})
    // } else if (!number) {
    //     return res.status(400).json({error: "number is missing"})
    // }

    // if (persons.find(p => p.name === name)) {
    //     return res.status(400).json({error: "name is already in phonebook"})
    // }

    const newPerson = new Entry({
        name: name,
        number: number
    })

    newPerson.save()
        .then(result => {
            res.json(result)
        })
        .catch(error => next(error))

})

const errorHandler = (error, req, res, next) => {
    console.error(error)

    if (error.name === 'CastError') {
        return res.status(400).send({error: 'malformed id'})
    }
    
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
