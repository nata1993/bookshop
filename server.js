const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');  // no need to use .js at the end cause express will do it for us
const shopRouter = require('./routes/shop');  // no need to use .js at the end cause express will do it for us
const port = 3000;
//const mongoConnect = require('./utilities/db').mongoConnect; like a built in in nodejs but with fever features

const User = require('./models/user');

// init app
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', ejs);
app.use(express.static('public'));  // for css

app.use((req, res, next) => {
    User.findById("60523d36fdb8422b0cc0d225")
    .then(user => {
        req.user = user;
        next();
    });
});

// the single route to specific page but we will use router
/*app.get('/admin/add-product', (req, res) =>{
    res.send("hello admin");

});*/

// using router for admin page
app.use('/admin', adminRouter); // if comes admin request, use admin router
// using router for shop page
app.use('/', shopRouter);

// must be last, else will be triggered before any other logic
app.use((req, res) => {
    res.render('404.ejs', { pageTitle: 'Page not found', path: ''});

    //res.status(404).sendFile(path.join(rootDir, 'views', '404.ejs')); // used to send specific file from specific place
});

// app will run on this port
mongoose.connect('mongodb://localhost:27017/BookStoreDB', {useUnifiedTopology: true})
.then( result => {
    User.findOne().then(user => {
        if(!user){
            const user = new User({
                name: 'John',
                email: 'a@a.ee',
                cart: {
                    item: []
                }
            });
            user.save();
        }
    });

    app.listen(port, () => {
        console.log(`app running on port ${port}\n`);
    });
})
.catch(error => {
    console.log("Could not start server!");
});

// "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe"