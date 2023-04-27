const express = require('express');
const router = express.Router();
const benchmarkingController = require('../controllers/benchmarkingController');

router.get('/', benchmarkingController.getAllBenchmarkings);
router.get('/:id', benchmarkingController.getBenchmarking);
router.post('/', benchmarkingController.createBenchmarking);
router.patch('/:id', benchmarkingController.updateBenchmarking);
router.delete('/:id', benchmarkingController.deleteBenchmarking);

module.exports = router;
