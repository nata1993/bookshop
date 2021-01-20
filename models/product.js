const fs = require('fs');   // filesystem
const path = require('path');
const filePath = path.join(path.dirname(require.main.filename), 'data', 'products.json');

module.exports = class Product {
    constructor(title, url, price, description){
        this.title = title,
        this.imageUrl = url,
        this.price = price,
        this.description = description
    }

    save(){ // save to products.json
        fs.readFile(filePath, (error, fileContent) => {
            let products = [];

            if(!error){
                products = JSON.parse(fileContent);
            }

            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), (error) => {
                console.log(error);
            });
        });
    }

    static fetchAll(cb){ // read from products.json
        fs.readFile(filePath, (error, fileContent) =>{
            if(error){
                cb([]);
            }

            cb(JSON.parse(fileContent));
        });
    }
};