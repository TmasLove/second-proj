const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport    = require('passport');

//Import the "dotenv" package and load variales from the ".env" file
//(must be at the top, before we try to use the )
require('dotenv').config();

require('./config/passport-config.js');


mongoose.connect(process.env.MONGODB_URI);


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(session({
  // the value of secret doesn't matter except it has to be different for every app
  secret: 'gkejsfl bKEJFBlwkswecfjk jhedsv c',
  resave: true,
  saveUninitialized: true
}));  // 2 parentheses: 1 for the "app.use"( "and another for "session"("
//-----------------------------------------------------------------------------
//passport middlewears, these need to come after the app.use(session(....));
app.use(passport.initialize());
app.use(passport.session());
//-----passport middlewears ^^ -------------------------------------------------

//THIS MIDDLEWARE CREATES the "currentUser" for ALL VIEWS
// (if the user is logged in)
// (this needs to be below passport and before your routes)
app.use((req, res, next) => {
//"req.user" is defined by the passport middleware
if (req.user) {
  // Create the "currentUser" local variable for all views
  res.locals.currentUser = req.user;
}
// if you dont do next() your pages will load forever
  next();
});
app.use(express.static(path.join(__dirname, 'public')));


//ROUTES GO HERE ------------------------------------------------------------
const index = require('./routes/index');
app.use('/', index);

const myAuthRoutes = require('./routes/auth-routes.js');
app.use('/', myAuthRoutes);


const myUserRoute = require('./routes/user-profile.js');
app.use('/', myUserRoute);

const myMemeRoute = require('./routes/create-meme.js');
app.use('/', myMemeRoute);


//ROUTES ^^ ------------------------------------------------------------------

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
