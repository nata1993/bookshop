const Product = require('../models/product')

// admin page 
exports.getAddProduct = (req, res) =>{
    res.render('admin/add-product.ejs',{
        PageTitle: 'Add product',
        Path: '/admin/add-product'   // used for marking what page is used and colors it yellow
    });
};

exports.postAddProduct = (req, res) =>{
    const product = new Product(req.body.title, req.body.imageUrl, req.body.price, req.body.description);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('admin/product.ejs',{
            Products: products,
            PageTitle: 'Admin Products',
            Path: '/admin/products'
        });
    });
}