const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

router.get('/', productController.fetchAll);
router.post('/', productController.create);
router.delete('/:id', productController.deleteProduct);
router.put('/:id', productController.update);

module.exports = router;