const Product = require('../models/product')

// admin page 
exports.getAddProduct = (req, res) =>{
    res.render('admin/edit-product.ejs',{
        pageTitle: 'Add product',
        path: '/admin/add-product',   // used for marking what page is used and colors it yellow in nav.ejs
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postAddProduct = (req, res) =>{
    const product = new Product({
        title: req.body.title, 
        price: req.body.price, 
        description: req.body.description, 
        imageUrl: req.body.imageUrl,
        userId: req.user._id
    });
    product.save()

    .then(result => {
        console.log("product saved");
        res.redirect("/admin/products");
    })
    .catch(error => {
        console.log("product not saved:\n" + error);
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
            product: product,
            isAuthenticated: req.session.isLoggedIn
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

    Product.findById(productId).then(product => {
        product.title = updatedTitle;
        product.description = updatedDescription;
        product.imgUrl = updatedImageurl;
        product.price = updatedPrice;

        return product.save();
    })
    .then(result => {
        console.log("Updated product!");
    })
    .catch(error => {
        console.log("Could not save updated product:\n" + error);
    });
    res.redirect('/admin/products');
};

exports.getProducts = (req, res) => {
    Product.find()      // fetchAll() here we wrote it ourselves but mongoose has it built in find()
    .then(products => {
        res.render('admin/products.ejs',{
            products: products,
            pageTitle: 'Admin Products',
            path: '/admin/products', // used for marking what page is used and colors it yellow in nav.ejs
            isAuthenticated: req.session.isLoggedIn
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

    Product.findByIdAndDelete(productId)
    .then(() => {
        console.log("deleted " + title + "\n");
        return res.redirect('/admin/products');
    })
    .catch(error => {
        console.log("Could not delete product:\n" + error);
    });
};