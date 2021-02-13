const fs = require('fs');
const path = require('path');
const filePath = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice){
        fs.readFile(filePath, (error, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0
            };

            if(!error){
                cart = JSON.parse(fileContent);
            }else{
                console.log("error reading the cart file");
            }

            // analize the cart to dinf existing products
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty+1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;     
            }else{
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct]; 
            }

            cart.totalPrice = cart.totalPrice + +productPrice;

            fs.writeFile(filePath, JSON.stringify(cart), error => {
                if(error)
                    console.log('failed to write to cart');
            });
        });
    }

    static getCart(cb){
        fs.readFile(filePath, (error, fileContent) => {
            if(error){
                return cb([]);
            }

            cb(JSON.parse(fileContent));
        });
    }
}