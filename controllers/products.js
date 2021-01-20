const Product = require('../models/product');

// admin page 
exports.getAddProduct = (req, res) =>{
    res.render('admin/add-product.ejs',{
        PageTitle: 'Add product',
        Path: '/admin/add-product'  // why we need path? we need it for rendering ejs file e.g. from where we take the ejs file in the views folder
    });
};

exports.postAddProduct = (req, res) =>{
    const product = new Product(req.body.title, req.body.imageUrl, req.body.price, req.body.description);
    product.save();
    res.redirect('/');
};

// main page
exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/index.ejs', {
            productsMain: products,
            PageTitle: 'Main Page',
            Path: '/'       // why path?
        });
    });
};