const { request } = require('express');
const express = require('express');
const app = express();

const PORT = 3001;

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
]

const date = new Date();

app.get('/api/persons', (request, response) => {
    response.json(notes);
});

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook as info for ${notes.length} people</p> <p>${date}</p>`);
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}.`);
})