const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

// shop page 
exports.getProducts = (req, res) =>{
    Product.find()
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
    req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items;
        res.render('shop/cart.ejs', {
            path: 'cart',
            pageTitle: 'Your cart',
            products: products
        });
    })
    .catch(error => {
        console.log("Error with cart fetch:\n" + error);
    });
}

exports.postCart = (req, res) => {
    const productId = req.body.productId; 
    Product.findById(productId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log("saved to cart");
        res.redirect('/cart');
    })
    .catch(error=> {
        console.log("Could not add product to cart:\n" + error);
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
    req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items.map(item => {
            return { qty: item.qty, product: {...item.productId._doc} };
        });
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            products: products
        });

        return order.save();
    })
    .then(() => {
        return req.user.clearCart();
    })
    .then(() => {
        res.redirect('/orders');
    })
    .catch(error => {
        console.log("could not add stuff to order:\n" + error);
    });;
}

exports.getOrders = (req, res) => {
    Order.find({'user.userId' : req.user._id })
    .then(orders => {
        res.render('shop/orders.ejs', {
            path: '/orders',
            pageTitle: 'Your orders',
            orders: orders
        });
    })
    .catch(error => {
        console.log("Could not show orders");
    });
}