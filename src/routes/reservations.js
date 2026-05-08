const express = require('express');
const router  = express.Router();
const {
  getReservations,
  addReservation,
  deleteReservation,
  updateStatus,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/',           getReservations);   // GET    /api/reservations
router.post('/',          addReservation);    // POST   /api/reservations
router.delete('/:id',     deleteReservation); // DELETE /api/reservations/:id
router.put('/:id/status', updateStatus);      // PUT    /api/reservations/:id/status

module.exports = router;
