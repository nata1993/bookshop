/*const path = require('path');   // used for not caring about which server we will be using and used to get root directory path
const rootDir = require('../utilities/path');*/
const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');

router.get('/', productController.getProducts);
router.get('/products');
router.get('/cart');
router.get('/checkout');

// export router or else we cant use it
module.exports = router;