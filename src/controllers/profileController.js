const User = require('../models/User');

// GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      data: {
        name:     user.name,
        email:    user.email,
        phone:    user.phone,
        pharmacy: user.pharmacy,
        location: user.location,
        role:     user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/profile  — fields: name, email, phone, pharmacy, location
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, pharmacy, location } = req.body;

    // Don't allow password or role change through this route
    const updates = {};
    if (name     !== undefined) updates.name     = name;
    if (email    !== undefined) updates.email    = email;
    if (phone    !== undefined) updates.phone    = phone;
    if (pharmacy !== undefined) updates.pharmacy = pharmacy;
    if (location !== undefined) updates.location = location;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Profile saved successfully',
      data: {
        name:     user.name,
        email:    user.email,
        phone:    user.phone,
        pharmacy: user.pharmacy,
        location: user.location,
        role:     user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
