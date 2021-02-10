const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getCart = (req, res) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(product of products){
                const cartProductData = cart.product.find(cartProduct => cartProduct.id === product.id);
                if(cartProductData){
                    cartProducts.push({productData: products, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart.ejs', {
                Path: '/cart',
                PageTitle: 'Your cart',
                products: cartProducts
            });
        });
    });
}

exports.postCart = (req, res) => {
    const productId = req.body.productId; 
    Product.findById(productId, (product) =>{
        Cart.addProduct(productId, product.price);
        res.redirect('/cart');
    });
}
// https://www.w3schools.com/w3css/img_nature.jpg