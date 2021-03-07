const Product = require('../models/product')

// admin page 
exports.getAddProduct = (req, res) =>{
    res.render('admin/edit-product.ejs',{
        pageTitle: 'Add product',
        path: '/admin/add-product',   // used for marking what page is used and colors it yellow in nav.ejs
        editing: false
    });
};

exports.postAddProduct = (req, res) =>{
    const product = new Product(req.body.title, req.body.imageUrl, req.body.price, req.body.description);
    product.save()
    .then(result => {
        console.log("product saved");
        res.redirect("/admin/products");
    })
    .catch(error => {
        console.log("product not saved");
        res.redirect('/');
    }); 
};

exports.getEditProduct = (req, res) =>{
// /admin/edit-product/0.45509088659039443?editing=true - what comes after ? is req.query, before it is req.params

    const editMode = req.query.editing;
    const productId = req.params.productId;

    Product.findById(productId)
    .then(product => {
        if(!product){
            return res.redirect('/');
        }

        console.log(product);

        res.render('admin/edit-product.ejs', {
            pageTitle: "Edit product",
            path: "admin/edit-product",
            editing: editMode,
            product: product
        });
    })
    .catch(error => {
        console.log("Error on product editing: " + error);
    });
};

exports.postEditProduct = (req, res) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageurl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    const updatedProduct = new Product(updatedTitle, updatedImageurl, updatedPrice, updatedDescription, productId);
    updatedProduct.save();
    res.redirect('/admin/products');
};

exports.getProducts = (req, res) => {
    Product.fetchAll()
    .then(_products => {
        res.render('admin/products.ejs',{
            products: _products,
            pageTitle: 'Admin Products',
            path: '/admin/products' // used for marking what page is used and colors it yellow in nav.ejs
        });
    })
    .catch(error => {
        console.log("Failed to fetch all for admin controller");
    });
};

exports.postDeleteProduct = (req, res) => {
    const productId = req.body.productId;
    const title = req.body.title;

    if(!productId){
        return res.redirect('/');
    }

    Product.deleteById(productId)
    .then(() => {
        console.log("deleted " + title + "\n");
        return res.redirect('/admin/products');
    });
};