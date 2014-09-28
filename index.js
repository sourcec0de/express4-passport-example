'use strict';

var express      = require('express');
var passport     = require('passport');
var flash        = require('connect-flash');
var sessions     = require('client-sessions');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var app          = express();

/**
 * Configure Passport
 * ========================
 */

require('./lib/auth/serialization');
require('./lib/auth/local');

/**
 * Configure Express
 * ========================
 */

app.set('view engine','jade');
app.engine('jade', require('jade').__express);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// I'm a cookie session
// I am more scalable than a Redis session store
// Probably the best solution unless you need a complicated authentication
// system like say... facebooks... where you need to kill active sessions and remove access

app.use(sessions({
    cookieName: 'session',                           // cookie name dictates the key name added to the request object passport requires `session`
    secret: 'the most secret secret of all secrets', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000,                   // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5                    // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));


// initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


/**
 * Configure Routes
 * ========================
 */

// global handler
// log session info
app.use(function (req, res, next) {
    console.log('user', req.user);
    console.log('session',req.session);
    res.locals.user = req.user;
    next();
});

// welcome your user
app.get('/', function (req, res){

    // set my greeting
    var message = 'Hey, you found my app!';

    // isAuthenticated is a passport method
    if (req.isAuthenticated()) {
        message = 'Hello, '+req.user.username;
    }

    return res.render('index',{
        message: message
    });

});

// show login page
app.get('/login', function (req, res){
    return res.render('login', {
        // errors is an array
        errors: req.flash('error')
    });
});

// log a user out on all methods to logout
app.all('/logout', function(req, res){

    if (req.isAuthenticated()) {
        req.logout();
    }

    return res.redirect('/');
});


// mount passport local auth request handler
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: 'username and password were incorrect',
    })
);

/**
 * Start application on port
 * =========================
 */
app.listen(3082, function (err) {

    if (err) {
        throw err;
    }

    console.log('app is listening on port %d', 3082);
});