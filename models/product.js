const fs = require('fs');   // filesystem
const path = require('path');
const filePath = path.join(path.dirname(require.main.filename), 'data', 'products.json');

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

    static deleteById(arr, id){
        /*const requiredIndex = arr.findIndex(el => {
           return el.id === id;
        });
        if(requiredIndex === -1){
           return false;
        };
        return arr.splice(requiredIndex, 1);*/
        
        for(let i = 0; i < arr.length; i++){
            console.log(arr[i]);
            if(arr[i].id === id){
                delete arr[i];
            }
        }
        fs.writeFile(filePath, JSON.stringify(arr), (error) => {
            console.log("Product model WiteFile \"deleting\": " + error)
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