const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  // ── Fields matching your Requests.js form ──────────
  name:     { type: String, required: [true, 'Patient name is required'], trim: true },  // "Patient Name"
  medicine: { type: String, required: [true, 'Medicine name is required'], trim: true }, // "Medicine"
  phone:    { type: String, default: '' },                                               // "Phone"

  // ── Status (shown as badge in table) ───────────────
  status: { type: String, enum: ['pending', 'fulfilled', 'cancelled'], default: 'pending' },

  // ── Meta ────────────────────────────────────────────
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);
