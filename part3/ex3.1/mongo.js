const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('Usage: node mongo.js <password>')
    console.log('or: node mongo.js <password> <new_name> <new_number>')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://fullstack-3c:${password}@cluster0.tmqyd.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const entrySchema = new mongoose.Schema({
    name: String,
    number: String
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 3) {
    Entry.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(entry => {
            console.log(`${entry.name} ${entry.number}`)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
    const newEntry = new Entry({
        name: process.argv[3],
        number: process.argv[4]
    })

    newEntry.save().then(response => {
        console.log(`added ${newEntry.name} number ${newEntry.number} to phonebook`)
        mongoose.connection.close()
    })
    
}