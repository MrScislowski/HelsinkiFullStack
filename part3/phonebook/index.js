const express = require('express')
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
  console.log(`found person is: ${JSON.stringify(entry)}`)
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
  const newEntry = {
    id: generateId(),
    name: providedBody.name,
    number: providedBody.number,
  }

  persons = persons.concat(newEntry);

  res.json(newEntry)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})