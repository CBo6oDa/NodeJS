var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require('passport');
var authenticate = require('./authenticate');

var session = require('express-session');
var FileStore = require('session-file-store')(session);
var favoriteRouter = require('./routes/favoriteRouter');
const uploadRouter = require('./routes/uploadRouter');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promotionRouter');
var leaderRouter = require('./routes/leaderRouter');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var config = require('./config');
const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

var app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});
//app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use('/', indexRouter);
  app.use('/favorites', favoriteRouter);
  app.use('/users', usersRouter);
  app.use('/dishes',dishRouter);
  app.use('/promotions',promoRouter);
  app.use('/leaders',leaderRouter);
  app.use('/imageUpload',uploadRouter);
  
  function auth (req, res, next) {
    console.log(req.user);

    if (!req.user) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');                          
      err.status = 401;
      next(err);
    }
    else {
          next();
    }
  }

// app.use(auth);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
