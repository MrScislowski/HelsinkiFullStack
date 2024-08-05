const express = require('express')
var morgan = require('morgan')

const app = express()

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(express.json())

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
  res.json(persons)
})

app.get("/info", (req, res) => {
  const message = `Phonebook has info for ${persons.length} people <br /> ${new Date().toUTCString()}`

  res.send(message)
})

app.get("/api/persons/:id", (req, res) => {

  const id = req.params.id
  const entry = persons.find(person => person.id === id);
  if (entry) {
    res.json(entry)
  } else {
    res.status(404).end()
  }
})

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id);

  res.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

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