/*const path = require('path');   // used for not caring about which server we will be using and used to get root directory path
const rootDir = require('../utilities/path');*/
const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');

router.get('/add-product', productController.getAddProduct);    // no () at the end, else it will be intstantly called = bug
router.get('/products');

router.post('/add-product', productController.postAddProduct);


// export router or else we cant use it
//module.exports = router;

module.exports = router;