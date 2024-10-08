const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://danieljscislowski:${password}@cluster0.chxji.mongodb.net/helsinkifullstackPhonebook?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook: ')

  Person.find({}).then(data => {
    data.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(0)
  })
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const newPerson = new Person({
    name, number
  })

  newPerson.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()

  })
}
