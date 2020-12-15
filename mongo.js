const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log("Please start this application with: node mongo.js <password> <name> <number>");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@phonebook.d2pdo.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

const personSchema = mongoose.Schema({
    name: String,
    number: Number
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
    const newName = process.argv[3];
    const newNumber = process.argv[4];

    const newPerson = new Person({
        name: newName,
        number: newNumber
    })

    newPerson.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook`);
        mongoose.connection.close();
    })
}

else {
    Person.find({}).then(result => {
        result.forEach(item => console.log(item));
        mongoose.connection.close();
    })
}