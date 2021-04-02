const User = require('../models/user');

exports.getLogin = (req, res) => {
    res.render('auth/login.ejs', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res) => {
    User.findById("60523d36fdb8422b0cc0d225")
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(() => {
            res.redirect('/');
        });
    })
    .catch(error => {
        console.log("Could not login\n"  + error);
    });
};

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};