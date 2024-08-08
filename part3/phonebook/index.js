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

const errorHandler = (error, req, res, next) => {

  console.log("Error being handled by error handler...")
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 
  console.log(`An error has happened!!!`);
  console.log(`error: ${JSON.stringify(error)}`)
  next(error)
}


app.get("/api/persons", (req, res, next) => {
  Person.find({})
  .then(persons => {
    res.json(persons)
  })
  .catch(error => next(error))
})

app.get("/info", (req, res, next) => {
  Person.find({})
  .then(persons => {
    const message = `Phonebook has info for ${persons.length} people <br /> ${new Date().toUTCString()}`
    res.send(message)
  })
  .catch(error => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {

  const id = req.params.id
  Person.findOne({_id: id})
  .then(person => {
    if (person) {
      return res.json(person)
    } else {
      return res.status(404).end()
    }
  })
  .catch(error => {
    console.log("An error has happened...")
    console.log(`Error name is ${error.name}`)
    next(error)
  })
})

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  Person.findOneAndDelete({_id: id})
    .then(response => {
      if (response) {
        return res.json(response).status(204).end()
      } else {
        return res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
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

  proposedNewEntry.save()
  .then(result => {
    res.json(result)
  })
  .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})