const mongodb = require('mongodb');
const getDB = require('../utilities/db').getDB;

class Product{
    constructor(title, imageUrl, price, description, id){
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this.id = id ? new mongodb.ObjectId(id) : null  ;
    }

    save(){
        const db = getDB(); // connect to mongo db
        let dbOperation;

        if(this._id){
            dbOperation = db.collection('products').updateOne({_id: this._id}, {$set: this});
        } else {
            dbOperation = db.collection('products').insertOne(this);
        }

        return dbOperation.then(result => {
            console.log("success");
        })
        .catch(error => {
            throw error;
        });
    }

    static fetchAll(){
        const db = getDB();

        return db.collection("products").find().toArray()
        .then(products => {
            return products;
        })
        .catch(error=> {
            console.log("Failed to fetch all poducts");
        });
    }

    static findById(productId){
        const db = getDB();

        return db.collection("products").find({_id: new mongodb.ObjectId(productId)})
        .then(product => {
            return product;
        })
        .catch(error => {
            console.log("failed to fetch the product details");
        });
    };
}

module.exports = Product;