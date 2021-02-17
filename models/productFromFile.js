const fs = require('fs');   // filesystem
const path = require('path');
const filePath = path.join(path.dirname(require.main.filename), 'data', 'products.json');
const Cart = require('./cart');

// read from products.json
const getProductsFromFile = (cb) => {
    fs.readFile(filePath, (error, fileContent) =>{
        if(error){
            return cb([]);
        }

        return cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(id, title, url, price, description){
        this.id = id,
        this.title = title,
        this.imageUrl = url,
        this.price = price,
        this.description = description
    }

    save(){ // save to products.json
        getProductsFromFile(products => {
            if(this.id){
                const existingProductIndex = products.findIndex(product => product.id === this.id);
                const updatedProducts = [...products]; //spread operator
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) => {
                    console.log("Product model WiteFile \"editing\": " + error)
                });
            } else{
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(filePath, JSON.stringify(products), (error) => {
                    console.log("Product model writeFile \"adding\": " + error);
                });
            } 
        });
    }

    static deleteById(id){
        getProductsFromFile(products => {
            const product = products.find(productInArray => productInArray.id === id);
            const updatedProducts = products.filter(product => product.id !== id);

            fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) => {
                console.log("Product model WriteFile \"deleting\": " + error);
                Cart.deleteProducts(product.id, product.price);
            });
        });
    }

    static fetchAll(cb){
        getProductsFromFile(cb);
    }

    static findById(id, cb){
        getProductsFromFile(products => {
            // filter a product by its id
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
};