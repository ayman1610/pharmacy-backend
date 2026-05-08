const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  // ── Fields matching your Reservations.js form ──────
  name:     { type: String, required: [true, 'Customer name is required'], trim: true }, // "Customer Name"
  medicine: { type: String, required: [true, 'Medicine is required'], trim: true },      // "Medicine"
  date:     { type: String, default: '' },  // stored as "YYYY-MM-DD" string (matches your date input)

  // ── Status (computed from date in frontend, stored here too) ──
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },

  // ── Meta ────────────────────────────────────────────
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
