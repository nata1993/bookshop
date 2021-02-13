const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');  // no need to use .js at the end cause express will do it for us
const shopRouter = require('./routes/shop');  // no need to use .js at the end cause express will do it for us
const port = 3000;


// init app
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', ejs);
app.use(express.static('public'));  // for css

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
app.listen(port, () => {
    console.log(`app running on port ${port}\n`);
});