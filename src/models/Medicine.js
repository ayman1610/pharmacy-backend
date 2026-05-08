const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  // ── Core fields matching your frontend forms ────────
  name:        { type: String, required: [true, 'Medicine name is required'], trim: true },
  company:     { type: String, default: '', trim: true },        // matches "company" in your form
  price:       { type: Number, required: [true, 'Price is required'], min: 0, default: 0 },
  stock:       { type: Number, required: [true, 'Stock is required'], min: 0, default: 0 },
  expiry:      { type: String, default: '' },                    // stored as "YYYY-MM-DD" string (matches your date input)
  category:    {
    type: String,
    enum: ['Antibiotic', 'Painkiller', 'Antiviral', 'Antifungal', 'Vitamin', 'Antacid', 'Other', ''],
    default: ''
  },
  description: { type: String, default: '' },                    // from AddMedicine.js

  // ── Meta ────────────────────────────────────────────
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });

// Virtual: isLowStock (stock < 20, matching your frontend filter)
MedicineSchema.virtual('isLowStock').get(function () {
  return this.stock < 20;
});

MedicineSchema.set('toJSON',   { virtuals: true });
MedicineSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Medicine', MedicineSchema);
