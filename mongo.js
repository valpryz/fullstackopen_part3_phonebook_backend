const mongoose = require('mongoose')

if(process.argv.length < 3){
  console.log('password is required')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://valpryz:${password}@fullstackopen.futduwy.mongodb.net/personApp?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name : String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({ name, number })

if(process.argv.length === 5){
  person.save().then(person => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

if(process.argv.length === 3){
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}