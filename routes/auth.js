const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect secrets.
        res.redirect('/secrets');
    });

router.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/secrets',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect secrets.
        res.redirect('/secrets');
    });

module.exports = router;