require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/people');

const app = express();

const PORT = process.env.PORT;

// Middleware

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body);
});
const middleware = morgan(':method :url :status :res[content-length] - :response-time ms :body :req[header]');

app.use(express.static('build'));
app.use(middleware);
app.use(express.json());
app.use(cors());


// Handling Persons Get Requests

app.get('/api/persons', (request, response) => {
    Person.find({}).then(phonebook => {
        response.json(phonebook);
    })
});

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    });
})

// Handling Persons Delete Requests

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);

    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
})

// Handling Persons Post Requests

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!(body.name && body.number)) {
        return response.status(400).json({
            error: "name or number missing"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(newPerson => {
        response.json(newPerson);
    })
});

// Display Info Site

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook as info for ${persons.length} people</p> <p>${date}</p>`);
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}.`);
})