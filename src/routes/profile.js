const express = require('express');
const router  = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/',  getProfile);    // GET /api/profile
router.put('/',  updateProfile); // PUT /api/profile

module.exports = router;
