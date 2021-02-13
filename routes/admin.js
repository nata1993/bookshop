/*const path = require('path');   // used for not caring about which server we will be using and used to get root directory path
const rootDir = require('../utilities/path');*/
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/add-product', adminController.getAddProduct);    // no () at the end, else it will be instantly called = bug
router.get('/products', adminController.getProducts);
router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/add-product', adminController.postAddProduct);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);

// export router or else we cant use it
//module.exports = router;

module.exports = router;