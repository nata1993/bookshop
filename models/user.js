const getDB = require('../utilities/db').getDB;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectID;

class User {
    constructor(username, email, cart, id){
        this.name = username;
        this.email = email;
        this.cart = cart;   // {items: []}
        this._id = id;
    }

    static findById(userId){
        const db = getDB();

        return db.collection('users').findOne({_id: new ObjectId(userId)})
        .then(user => {
            return user;
        })
        .catch(error => {
            console.log("Could not get User from DB");
        });
    }

    addToCart(product){
        // find the product if index is in the cart

        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });

        let newQty = 1;

        const updatedCartItems = [... this.cart.items];

        if(cartProductIndex >= 0)
        {
            newQty = this.cart.items[cartProductIndex].qty +1;
            updatedCartItems[cartProductIndex].qty = newQty;
        } else {
            updatedCartItems.push({productId: new ObjectId(product._id), qty: newQty});
        }

        //save the products to cart and update database
        const updatedCart = {items: updatedCartItems};
        const db = getDB();

        return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}});
    }

    getCart(){
        // return client cart
        const db = getDB();

        const productIds = this.cart.items.map(i => {
            return i.productId;
        });

        return db.collection('products').find({_id: {$in: productIds}}).toArray()
        .then(products =>{
            return products.map(p => {
                return {...p, qty: this.cart.items.find(i => {
                    return i.productId.toString() === p._id.toString();
                }).qty
            }});
        });
    }
}

module.exports = User;