const express = require('express');
const router  = express.Router();
const {
  getMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getLowStock,
} = require('../controllers/medicineController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/low-stock', getLowStock);    // GET  /api/medicines/low-stock
router.get('/',          getMedicines);   // GET  /api/medicines?search=&filter=
router.get('/:id',       getMedicine);    // GET  /api/medicines/:id
router.post('/',         addMedicine);    // POST /api/medicines
router.put('/:id',       updateMedicine); // PUT  /api/medicines/:id
router.delete('/:id',    deleteMedicine); // DELETE /api/medicines/:id

module.exports = router;
