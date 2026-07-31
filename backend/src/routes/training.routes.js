const express = require('express');
const router = express.Router();
const TrainingController = require('../training/TrainingController');

router.post('/run', TrainingController.runTraining);

module.exports = router;
