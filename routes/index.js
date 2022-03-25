const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        User.find({ secrets: { $ne: null } }, (err, users) => {
            if (err) {
                console.log(err);
            } else {
                res.render('secrets', { usersWithSecrets: users });
            }
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/submit', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('submit');
    } else {
        res.redirect('/login');
    }
});

router.post('/submit', (req, res) => {
    User.findById(req.user.id, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            foundUser.secret = req.body.secret;
            foundUser.save(() => {
                res.redirect('/secrets');
            });
        }
    });
});


router.post('/register', (req, res) => {
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect('/register');
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
        }
    });
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/register'
}), (req, res) => {
    res.redirect('secrets');
})

module.exports = router;