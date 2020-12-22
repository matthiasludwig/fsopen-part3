require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/people')

const app = express()

const PORT = process.env.PORT

// Middleware

morgan.token('body', function (req) {
	return JSON.stringify(req.body)
})
const middleware = morgan(':method :url :status :res[content-length]B - :response-time ms :body :req[header]')

app.use(express.static('build'))
app.use(middleware)
app.use(express.json())
app.use(cors())


// Handling Persons Get Requests

app.get('/api/persons', (request, response) => {
	Person.find({}).then(phonebook => {
		response.json(phonebook)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			response.json(person)
		})
		.catch(error => next(error))
})

// Handling Persons Delete Requests

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(res => {
			if (res) {
				response.status(204).end()
			}
			else {
				response.status(404).send({ error: 'The requested Note is missing from server' })
			}
		})
		.catch(error => next(error))
})

// Handling Persons Post Requests

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	if (!(body.name && body.number)) {
		return response.status(400).send({ error: 'name or number missing' })
	}

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person
		.save()
		.then(savedPerson => savedPerson.toJSON())
		.then(savedAndFormattedPerson => response.json(savedAndFormattedPerson))
		.catch(error => next(error))
})

// Handling Person Update Request

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	if(!(body.name && body.number)) {
		return response.status(400).send({ error: 'name or number missing' })
	}

	const person = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query'})
		.then(updatedPerson => {
			if (updatedPerson === null) {
				response.status(404).send({ error: `Note "${person.name}" is missing from server` })
			}
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

// Display Info Site

app.get('/info', (request, response, next) => {
	const date = new Date()
	let phonebookLength
	Person.find({})
		.then(phonebook => {
			phonebookLength = phonebook.length
			response.send(`<p>Phonebook has info for ${phonebookLength} people</p> <p>${date}</p>`)
		})
		.catch(error => next(error))
})

// Middleware Unknown Endpoints & Error Logging

const unkownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unkownEndpoint)

const errorHandler = (error, request, response, next) => {
	if (error.name === 'CastError' || error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)

// Start express server

app.listen(PORT, () => {
	console.log(`Server running on ${PORT}.`)
})
