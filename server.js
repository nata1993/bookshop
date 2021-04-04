const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const csurf = require('csurf');
const MongoDBStore = require('connect-mongodb-session')(session);
const port = 3000;


const adminRouter = require('./routes/admin');  // no need to use .js at the end cause express will do it for us
const shopRouter = require('./routes/shop');  // no need to use .js at the end cause express will do it for us
const authRouter = require('./routes/auth');
//const mongoConnect = require('./utilities/db').mongoConnect; like a built in in nodejs but with fewer features
const User = require('./models/user');

// init app
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', ejs);
app.use(express.static('public'));  // for css

const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/BookStoreDB',
    collection: 'sessions'
});

const csurfProtection = csurf();
app.use(session({
    secret: 'my super-super secret secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

// use csurf
app.use(csurfProtection);
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(error => {
        console.log("Could not get user\n" + error);
    });
});

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// using router for authentication page
app.use(authRouter);
// using router for admin page
app.use('/admin', adminRouter); // if comes admin request, use admin router
// using router for shop page
app.use(shopRouter);


// must be last, else will be triggered before any other logic
app.use((req, res) => {
    res.render('404.ejs', { pageTitle: 'Page not found', path: '', isAuthenticated: req.session.isLoggedIn });

    //res.status(404).sendFile(path.join(rootDir, 'views', '404.ejs')); // used to send specific file from specific place
});

// app will run on this port
mongoose.connect('mongodb://localhost:27017/BookStoreDB', {useUnifiedTopology: true})
.then( result => {
    app.listen(port, () => {
        console.log(`App running on port ${port}\n`);
    });
})
.catch(error => {
    console.log("Could not start server!");
});

// "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe"