'use strict';

var _     = require('lodash');
var users = require('./users');
var passport = require('passport');

// serializing is for compression
// usefull for storing a way of locating a user record
// by the id that was stored in the cookie :D
passport.serializeUser(function(user, done) {
    console.log('serializing', user);
    done(null, user.id);
});

// I locate the user and attach it to the sesssion
passport.deserializeUser(function(id, done) {
    console.log('deserializing', id);
    var user = _.find(users, {id: id});
    console.log('found user', user);
    done(null, user);
});