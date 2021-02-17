const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = () => {
    MongoClient.connect('mongodb://localhost:27017/BookStoreDB', {useUnifiedTopology: true})
    .then(client => {
        console.log("Connected to DB.");
        _db = client.db();
    })
    .catch(error => {
        throw error;
    });
}

const getDB = () => {
    if(_db){
        return _db;
    }
    throw "No db found!";
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;