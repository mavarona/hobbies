const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const router = require('./routes');

const db = require('./config/db');
require('./models/Users');
require('./models/Categories');
require('./models/Groups');
require('./models/Meeti');
require('./models/Comments');
db.sync().then(() => console.log('DB Connected')).catch((err) => console.log(err));

require('dotenv').config({
    path: './variables.env'
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static('public'));

app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = {...req.user } || null;
    res.locals.messages = req.flash();
    const date = new Date();
    res.locals.year = date.getFullYear();
    next();
});

app.use('/', router());

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running in port ${port}`);
});