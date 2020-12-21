const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
    .then(result => {
        console.log('Successfully connected to mongodb');
    })
    .catch(error => {
        console.log(`error while connecting to mongodb: ${error}`);
    });

// Creation of Schema and mongoose Model

const personSchema = mongoose.Schema({
    name: String,
    number: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Person', personSchema);