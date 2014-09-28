'use strict';

var _     = require('lodash');
var users = require('./users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// configure the local login strategy
passport.use(new LocalStrategy(
    function(username, password, done) {

        console.log('using local login strategy');

        var user = _.find(users, {
            username: username,
            password: password
        });

        console.log('attempting to authenticate',username, password);
        console.log(user ? 'user was located successfuly' : 'could not find user');

        var failMessage = {
            message: 'failed to authenticate'
        };

        if (!user) {
            // the last argument to done is a object
            // that will be attached to a flash message
            return done(null, false, failMessage);
        }

        var validPassword = user ? user.password === password
                                 : false;

        console.log('%s password was %s',username, validPassword ? 'valid'
                                                                 : 'invalid');

        if (validPassword === false) {
            return done(null, false, failMessage);
        }

        return done(null, user);
    }
));