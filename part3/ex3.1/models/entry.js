const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const validatePhoneNumber = (phoneNumber) => {
  if (isNaN(phoneNumber.substring(0,2))) {
    return false
  }
  if (phoneNumber.substring(2, 3) !== '-' && isNaN(phoneNumber.substring(0, 3))) {
    return false
  }

  if (phoneNumber.substring(2, 3) === '-') {
    return !isNaN(phoneNumber.substring(3))
  }
  if (phoneNumber.substring(3, 4) === '-') {
    return !isNaN(phoneNumber.substring(4))
  }
  return false
}

const entrySchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3
    }, 
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: validatePhoneNumber
      },
      message: props => `${props.value} is not a valid phone number`
    } 
})

// const Entry = mongoose.model('Entry', entrySchema)

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry', entrySchema)