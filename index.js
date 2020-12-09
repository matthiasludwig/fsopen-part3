const express = require('express');
const app = express();

app.use(express.json());

const PORT = 3001;

let persons = [
    {
      name: "Arto Hellas",
      number: "040-12345",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]

// Helper functions and variables

const date = new Date();
const generateId = () => {
    return Math.floor(Math.random() * 1000);
}

// Handling Persons Get Requests

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const idPerson = Number(request.params.id);
    const contact = persons.find(item => item.id === idPerson)

    console.log(contact);

    if (contact) {
        response.json(contact);
    }
    else {
        response.status(404).end();
    }
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
    const nameExists = persons.find(item => item.name === body.name);

    if (!(body.name && body.number)) {
        return response.status(400).json({
            error: "name or number missing"
        })
    }

    else if (nameExists) {
        return response.status(400).json({
            error: "name already exists"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person);

    response.json(person);
});

// Display Info Site

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook as info for ${persons.length} people</p> <p>${date}</p>`);
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}.`);
})