const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

router.get('/', productController.fetchAll);
router.post('/', productController.create);
// router.put('/', productController.updateProduct);

module.exports = router;