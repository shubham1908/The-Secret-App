const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

module.exports = () => {
    passport.use(User.createStrategy());

    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/secrets'
        },
        function(accessToken, refreshToken, profile, cb) {
            User.findOrCreate({ username: profile.emails[0].value, googleId: profile.id }, function(err, user) {
                return cb(err, user);
            });
        }
    ));

    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:3000/auth/facebook/secrets",
            profileFields: ['id', 'emails']
        },
        function(accessToken, refreshToken, profile, cb) {
            // console.log(profile);
            User.findOrCreate({ username: profile.emails[0].value, facebookId: profile.id }, function(err, user) {
                return cb(err, user);
            });
        }
    ));

    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
            cb(null, { id: user.id, username: user.username });
        });
    });

    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });
}