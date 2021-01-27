const fs = require('fs');   // filesystem
const path = require('path');
const filePath = path.join(path.dirname(require.main.filename), 'data', 'products.json');

// read from products.json
const getProductsFromFile = (callback) => {
    fs.readFile(filePath, (error, fileContent) =>{
        if(error){
            return callback([]);
        }

        callback(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(title, url, price, description){
        this.title = title,
        this.imageUrl = url,
        this.price = price,
        this.description = description
    }

    save(){ // save to products.json
        this.id = Math.random().toString();

        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), (error) => {
                console.log("Filepath error: " + error);
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