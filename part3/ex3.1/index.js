const express = require('express')
const app = express()
const morgan = require('morgan')
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

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const phonebookInfo = `Phonebook has info for ${persons.length} people`
    const dateInfo = new Date().toString()
    res.send(`${phonebookInfo}<br>${dateInfo}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const found = persons.find(p => p.id === id)
    if (!found) {
        return res.status(404).end()
    }

    res.json(found)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

// creating new entries
app.post('/api/persons', (req, res) => {
    const {name, number} = req.body

    if (!name) {
        return res.status(400).json({error: "name is missing"})
    } else if (!number) {
        return res.status(400).json({error: "number is missing"})
    }

    if (persons.find(p => p.name === name)) {
        return res.status(400).json({error: "name is already in phonebook"})
    }

    const newPerson = {
        id: Math.floor(Math.random()*1e6),
        name: name,
        number: number
    }
    persons = persons.concat(newPerson)
    res.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)