const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport')
const methodOverride = require('method-override')

// Bring database connection
require('./database/users.database')

// Initialize the app
const app = express();

app.use(express.json())

// Cors Middleware
app.use(cors());

// Middlewares
// Form data middleware
app.use(bodyParser.urlencoded({
    extended: false
}))
// Json Body Middleware
app.use(bodyParser.json())

// seting up the static directory
app.use(express.static(path.join(__dirname, 'public')))

//User passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// use mehtod overide
app.use(methodOverride('_method'))

// Bring in the Passport Strategy
require('./config/passport')(passport);

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>{
    console.log("app lisent port: 5000")
})

// Bring user route from folder route
const UserRoute = require('./routes/api/users');
app.use('/', UserRoute)

app.delete('/api/users/logout', (req,res)=>{
    req.logOut()
    res.redirect('/api/users/profile')
})
