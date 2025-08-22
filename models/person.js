
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => console.log('connected to mongoDB'))
  .catch(error => console.log(`error connecting to mongoDB, ${error.message}`))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  } ,
  number: {
    type: String,
    validate: {
      validator: function(value){
        return /^\d{2,3}-\d{6,}$/.test(value)
      }
    },
    minLength: 8,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Person', personSchema)