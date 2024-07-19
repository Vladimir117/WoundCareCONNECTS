const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyController');

// Agency routes
router.get('/submission-list', agencyController.submissionList);
router.get('/submission-detail/:id', agencyController.submissionDetail);

module.exports = router;
