'use strict';
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');
//https://smashballoon.com/custom-facebook-feed/access-token/
//User = require('mongoose').model('User');

module.exports = function () {

    passport.use(new FacebookTokenStrategy({
        clientID: '1307380232764848',
        clientSecret: '23e36713b2b21519ee24a7d44daede0b'
    },
        function (accessToken, refreshToken, profile, done) {
            find({ facebookId: profile.id }, function (error, user) {
                return done(error, user);
            });
            console.log("Access token:: " + accessToken);
        }));
    function find(accessToken, refreshToken, profile, done) {
        console.log("Request:: " + profile);
    }
};

