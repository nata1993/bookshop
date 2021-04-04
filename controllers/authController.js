const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login.ejs', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: message
    });
};

exports.postLogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
    .then(userDoc => {
        if(!userDoc){
            req.flash('error', 'Invalid email or password!');
            return res.redirect('/login');
        }

        bcrypt.compare(password, userDoc.password)  //return true or false
        .then(match => {
            if(match){
                // set a session
                req.session.isLoggedIn = true;
                req.session.user = userDoc;
                return req.session.save(error => {
                    console.log("unknown error\n" + error);
                    res.redirect('/');
                });
            }  
            
            res.redicert('/login');
        })
        .catch(error => {
            console.log("Could not login\n"  + error);
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

exports.getSignup = (req, res) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup.ejs', {
        path: '/signup', 
        pageTitle: 'Sign up',
        isAuthenticated: false,
        errorMessage: message
    });
};

exports.postSignup = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
    .then( userDoc => {
        if(userDoc){
            req.flash('error', 'Email already exists!');
            return res.redirect('/signup');
        }
        
        return bcrypt.hash(password, 12)
        .then(hashedPass => {
            const user = new User({
                email: email,
                password: hashedPass,
                cart: { items: [] }
            });

            return user.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch( error => {
            console.log("Could not create new user:\n" + error);
        });
    })
    .catch( error => {
        console.log("Could not find existing user when creating new user:\n" + error);
    });;
}