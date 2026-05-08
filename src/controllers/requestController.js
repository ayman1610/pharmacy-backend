const Request = require('../models/Request');

// GET /api/requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/requests  — fields: name, medicine, phone
exports.addRequest = async (req, res) => {
  try {
    const { name, medicine, phone } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ success: false, message: 'Patient name is required' });
    if (!medicine || !medicine.trim())
      return res.status(400).json({ success: false, message: 'Medicine name is required' });

    const request = await Request.create({
      name:      name.trim(),
      medicine:  medicine.trim(),
      phone:     phone || '',
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: request });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/requests/:id
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/requests/:id/status  — update status (pending / fulfilled / cancelled)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, data: request });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
