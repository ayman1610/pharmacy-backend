const Medicine = require('../models/Medicine');

// GET /api/medicines  — list with search + stock filter (matches your frontend search/filter UI)
exports.getMedicines = async (req, res) => {
  try {
    const { search, filter } = req.query;
    let query = {};

    // Search by name OR company (matches your frontend search box)
    if (search) {
      query.$or = [
        { name:    { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    // Stock filter: "low" = stock < 20, "ok" = stock >= 20 (matches your select options)
    if (filter === 'low') query.stock = { $lt: 20 };
    if (filter === 'ok')  query.stock = { $gte: 20 };

    const medicines = await Medicine.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: medicines.length, data: medicines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/medicines/:id
exports.getMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
    res.json({ success: true, data: medicine });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/medicines  — fields: name, company, price, stock, expiry, category, description
exports.addMedicine = async (req, res) => {
  try {
    const { name, company, price, stock, expiry, category, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Medicine name is required' });
    if (stock === undefined || stock === '')
      return res.status(400).json({ success: false, message: 'Stock quantity is required' });

    const medicine = await Medicine.create({
      name,
      company:     company     || '',
      price:       parseFloat(price) || 0,
      stock:       parseInt(stock)   || 0,
      expiry:      expiry      || '',
      category:    category    || '',
      description: description || '',
      addedBy: req.user._id,
    });

    res.status(201).json({ success: true, data: medicine });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/medicines/:id  — edit all fields
exports.updateMedicine = async (req, res) => {
  try {
    const { name, company, price, stock, expiry, category, description } = req.body;

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      {
        ...(name        !== undefined && { name }),
        ...(company     !== undefined && { company }),
        ...(price       !== undefined && { price: parseFloat(price) }),
        ...(stock       !== undefined && { stock: parseInt(stock) }),
        ...(expiry      !== undefined && { expiry }),
        ...(category    !== undefined && { category }),
        ...(description !== undefined && { description }),
      },
      { new: true, runValidators: true }
    );

    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
    res.json({ success: true, data: medicine });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/medicines/:id
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
    res.json({ success: true, message: 'Medicine deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/medicines/low-stock  — medicines with stock < 20
exports.getLowStock = async (req, res) => {
  try {
    const medicines = await Medicine.find({ stock: { $lt: 20 } }).sort('stock');
    res.json({ success: true, count: medicines.length, data: medicines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
