require('dotenv').config();
const express = require('express');
const session = require('express-session');
const ejs = require('ejs');
const connectDB = require('./config/db');
const passport = require('passport');


const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

connectDB();
require('./config/passport')();

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
})