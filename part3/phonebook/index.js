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
  Person.findOneAndDelete({_id: id})
    .then(response => {
      if (response) {
        return res.json(response).status(204).end()
      } else {
        return res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).end()
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

  // // Ignore this check, according to https://fullstackopen.com/en/part3/saving_data_to_mongo_db#exercises-3-13-3-14
  // if (persons.find(person => person.name === providedBody.name)) {
  //   return res.status(409).json({error: "name must be unique"});
  // }

  const proposedNewEntry = new Person({
    name: providedBody.name,
    number: providedBody.number,
  })

  proposedNewEntry.save().then(result => {
    res.json(result)
  })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})