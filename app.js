const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Load user model
require('./models/User');

// Load story model
require('./models/Story');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

// Load keys
const keys = require('./config/keys');

// Handlebars Helpers
const helpers = require('./helpers/hbs');
// Map global promises
mongoose.Promise = global.Promise;
// Mongoose connect
mongoose.connect(keys.mongoURI, {useNewUrlParser: true})
.then(() => {
  console.log('MongoDB Connected');
})
.catch(() => {
  console.log(error);
});

const app = express();

// BodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Method override middleware
app.use(methodOverride('_method'));

// Handlebars middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: helpers.truncate,
    stripTags: helpers.stripTags,
    formatDate: helpers.formatDate,
    select: helpers.select,
    editIcon: helpers.editIcon
  },
  defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server started on port " + port);
});