const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();
var path = require('path');
var getIP = require('ipware')().get_ip;

var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var configDB = require('./config/db.js');
var morgan       = require('morgan');


var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); 
app.use(cookieParser());

passport.use(new Strategy({
    consumerKey: "Yb7v7JgGFBFJAIxg1UhAYMGLI",
    consumerSecret: "dN80LjyBKYDLY5XQl0oSTNZsaznGw99dHeEMU5L8daJ4j1Za30",
    callbackURL: 'https://vote12.herokuapp.com//login/twitter/return'
  },
  function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(require('express-session')({ secret: 'keyboardsecret2sdfscat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());




app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/view'));


app.use("/node_modules", express.static('node_modules'));
app.use("/app", express.static('app'));
app.use("/public/view/", express.static('public/view'));







MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  require('./app/routes')(app, database, passport);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})

