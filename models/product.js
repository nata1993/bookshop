const mongodb = require('mongodb');
const getDB = require('../utilities/db').getDB;
const ObjectId = mongodb.ObjectID;

class Product{
    constructor(title, imageUrl, price, description, id){
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this._id = id ? new ObjectId(id) : null;    // _id is mongoDB _id
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

        return db.collection("products").find({_id: new ObjectId(productId)}).next()
        .then(product => {
            return product;
        })
        .catch(error => {
            console.log("failed to fetch the product details");
        });
    }

    static deleteById(productId){
        const db = getDB();

        return db.collection("products").deleteOne({_id: new ObjectId(productId)})
        .then(result => {
            console.log("product succesfully deleted");
        })
        .catch(error => {
            console.log("Coud not delete product fron DB");
        });
    }
}

module.exports = Product;