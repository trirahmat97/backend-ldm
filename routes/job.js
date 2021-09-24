const express = require('express');
const router = express.Router();
const JobController = require('../controllers/job');

router.get('/', JobController.findAllJob);
router.get('/report', JobController.findAllJobReport);
router.get('/:id', JobController.findJobById);
router.post('/', JobController.addJob);
router.put('/:id', JobController.updateJob);
router.delete('/:id', JobController.deleteJob);

router.post('/sendjob', JobController.sendJob);
router.post('/sendProduct', JobController.sendProduct);
router.get('/detail/detailJob', JobController.findAllDetailJob);
router.get('/detail/detailJob/:id', JobController.findAllDetailJobById);

router.post('/addProducttoJob', JobController.addProducttoJob);
// router.delete('/deleteProducttoJob/:id', JobController.deleteProducttoJob);
router.delete('/deleteUsertoJob/:id', JobController.deleteUsertoJob);
router.delete('/deleteProductToJobById/:id', JobController.deleteProductToJob2);
router.patch('/editProductToJob', JobController.editProductToJob);

module.exports = router;