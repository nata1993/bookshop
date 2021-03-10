const Product = require('../models/product');
const Cart = require('../models/cart');

// shop page 
exports.getProducts = (req, res) =>{
    Product.fetchAll()
    .then(products => {  // callback arrow function
        res.render('shop/product-list.ejs',{
            productsMain: products,
            pageTitle: 'Main Page',
            path: '/products'
        });
    })
    .catch(error => {
        console.log("Failed to fetch for shop controller");
    });
};

exports.getProduct = (req, res) =>{
    const productId = req.params.productId;
    
    Product.findById(productId).then(product => {
        res.render('shop/product-detail.ejs', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });
};

exports.getCart = (req, res) => {
    req.user.getCart()
    .then(products => {
        res.render('shop/cart.ejs', {
            path: 'cart',
            pageTitle: 'Your cart',
            products: products
        });
    })
    .catch(error => {
        console.log("Error with cart fetch");
    });
}

exports.postCart = (req, res) => {
    const productId = req.body.productId; 
    Product.findById(productId)
    .then(product => {
        req.user.addToCart(product);
    })
    .then(result => {
        console.log("saved to cart");
        res.redirect('/cart');
    });  
}

exports.postDeleteFromCart = (req, res) => {
    const productId = req.body.productId;
    req.user.deleteItemFromCart(productId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(error => {
        console.log("Could not delete item from cart");
    });
}

exports.postOrder = (req, res) => {

}

exports.getOrders = (req, res) => {

}