
const mongoose = require('mongoose');

// Bring keys database from config folder
const mongoURI = require('../config/keys').mongoURI;

// Connect to database
mongoose.connect(mongoURI,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('Database connected successfullyy ' +mongoURI)
}).catch(err => console.log('Unabe to connect with the database' + err))