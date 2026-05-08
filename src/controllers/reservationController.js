const Reservation = require('../models/Reservation');

// GET /api/reservations
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/reservations  — fields: name, medicine, date
exports.addReservation = async (req, res) => {
  try {
    const { name, medicine, date } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    if (!medicine || !medicine.trim())
      return res.status(400).json({ success: false, message: 'Medicine name is required' });

    const reservation = await Reservation.create({
      name:      name.trim(),
      medicine:  medicine.trim(),
      date:      date || '',
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: reservation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/reservations/:id
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation)
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    res.json({ success: true, message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/reservations/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!reservation)
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    res.json({ success: true, data: reservation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
