const express = require('express');
const router  = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getDashboard); // GET /api/dashboard

module.exports = router;
