const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

router.get('/', categoryController.getCategory);
router.get('/all', categoryController.getAllCategory);
router.post('/', categoryController.createCategory);
router.patch('/:id', categoryController.editCategory);
router.delete('/:id', categoryController.deleteCategory);
router.get('/getParent', categoryController.getAllCategoryParent);

module.exports = router;