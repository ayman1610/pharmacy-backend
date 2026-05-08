const express = require('express');
const router  = express.Router();
const {
  getRequests,
  addRequest,
  deleteRequest,
  updateStatus,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/',              getRequests);   // GET    /api/requests
router.post('/',             addRequest);    // POST   /api/requests
router.delete('/:id',        deleteRequest); // DELETE /api/requests/:id
router.put('/:id/status',    updateStatus);  // PUT    /api/requests/:id/status

module.exports = router;
