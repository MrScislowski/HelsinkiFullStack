const express = require('express')
const morgan = require('morgan')
const cors = require("cors")


require('dotenv').config()

const Person = require('./models/Person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms', 
    tokens.method(req, res) === "POST" ? JSON.stringify(req.body) : ""
  ].join(" ")
}))

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get("/info", (req, res) => {
  Person.find({}).then(persons => {
    const message = `Phonebook has info for ${persons.length} people <br /> ${new Date().toUTCString()}`
    res.send(message)
  })
})

app.get("/api/persons/:id", (req, res) => {

  const id = req.params.id
  Person.findOne({_id: id}).then(person => {
    if (person) {
      return res.json(person)
    } else {
      return res.status(404).end()
    }
  })
})

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id
  Person.findOneAndDelete({_id: id}).then(response => {
    if (response) {
      return res.json(response).status(204).end()
    } else {
      return res.status(404).end()
    }
    
  })
})

app.post("/api/persons", (req, res) => {
  const providedBody = req.body;

  // check that name exists, number exists, name is unique
  if (!providedBody.name) {
    return res.status(400).json({error: "missing name"})
  }
  if (!providedBody.number) {
    return res.status(400).json({error: "missing number"})
  }

  if (persons.find(person => person.name === providedBody.name)) {
    return res.status(409).json({error: "name must be unique"});
  }

  const newEntry = {
    id: generateId(),
    name: providedBody.name,
    number: providedBody.number,
  }

  persons = persons.concat(newEntry);

  res.json(newEntry)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})