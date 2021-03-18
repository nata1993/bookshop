//ODM - object document mapping

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type : String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        // embedded document
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);