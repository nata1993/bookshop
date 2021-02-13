const Product = require('../models/product')

// admin page 
exports.getAddProduct = (req, res) =>{
    res.render('admin/edit-product.ejs',{
        pageTitle: 'Add product',
        path: '/admin/add-product',   // used for marking what page is used and colors it yellow
        editing: false
    });
};

exports.postAddProduct = (req, res) =>{
    const product = new Product(req.body.title, req.body.imageUrl, req.body.price, req.body.description);
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res) =>{
    const editMode = req.query.editing;
    const productId = req.params.productId;

    Product.findById(productId, product => {
        if(!productId){
            return res.redirect('/');
        }
    
        res.render('admin/edit-product.ejs',{
            pageTitle: 'Edit product',
            path: '/admin/edit-product',   // used for marking what page is used and colors it yellow
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageurl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    const updatedProduct = new Product(productId, updatedTitle, updatedImageurl, updatedPrice, updatedDescription);
    updatedProduct.save();
    res.redirect('/admin/products');
};

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('admin/products.ejs',{
            Products: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};
