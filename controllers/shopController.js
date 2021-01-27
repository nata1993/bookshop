const Product = require('../models/product');

// shop page 
exports.getProducts = (req, res) =>{
    Product.fetchAll(products => {
        res.render('shop/product-list.ejs',{
            productsMain: products,
            PageTitle: 'Main Page',
            Path: '/products'
        });
    });
};

exports.getProduct = (req, res) =>{
    const productId = req.params.productId;
    
    Product.findById(productId, product => {
        res.render('shop/product-detail.ejs', {
            product: product,
            PageTitle: product.title,
            Path: '/products'
        });
    });
};

// https://www.w3schools.com/w3css/img_nature.jpg