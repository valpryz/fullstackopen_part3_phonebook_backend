require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('person', function (req, res) { 
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))  
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(person => person.id === id)

  if(person){
    res.json(person)
  }else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name || !body.number) {
    return res.status(400).json({error: "name or number is missing"})
  }

  // if(persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())){
  //   return res.status(400).json({error: "name must be unique"})
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  
  person.save()
    .then(savedPerson => res.json(savedPerson))
  
})

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})