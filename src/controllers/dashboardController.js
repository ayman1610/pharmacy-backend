const Medicine    = require('../models/Medicine');
const Request     = require('../models/Request');
const Reservation = require('../models/Reservation');

// GET /api/dashboard
// Returns everything your Dashboard.js needs:
//   - cards: totalMedicines, totalRequests, totalReservations, lowStock count
//   - chart data: medicines with name + stock (for the bar chart)
//   - notifications: low stock warnings, pending requests, upcoming reservations
//   - recentInventory: last 5 medicines (for the Recent Inventory table)
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    const [medicines, requests, reservations] = await Promise.all([
      Medicine.find().sort({ createdAt: -1 }),
      Request.find().sort({ createdAt: -1 }),
      Reservation.find().sort({ createdAt: -1 }),
    ]);

    // ── Low stock (stock < 20, matches frontend filter) ──
    const lowStockMedicines = medicines.filter(m => m.stock < 20);

    // ── Upcoming reservations (date >= today) ──
    const upcomingReservations = reservations.filter(r => r.date >= today);
    const pastReservations     = reservations.filter(r => r.date < today);

    // ── Pending requests ──
    const pendingRequests = requests.filter(r => r.status === 'pending');

    // ── Notifications (mirrors your Dashboard.js notification logic) ──
    const notifications = [
      ...lowStockMedicines.map(m => ({
        type: 'warn',
        icon: '⚠️',
        text: `${m.name} is low on stock (${m.stock} units)`,
        time: 'Needs attention',
      })),
      ...(pendingRequests.length
        ? [{ type: 'info', icon: '📋', text: `${pendingRequests.length} pending request(s)`, time: 'Today' }]
        : []),
      ...(upcomingReservations.length
        ? [{ type: 'success', icon: '📅', text: `${upcomingReservations.length} reservation(s) scheduled`, time: 'Upcoming' }]
        : []),
      ...(!lowStockMedicines.length && !pendingRequests.length && !upcomingReservations.length
        ? [{ type: 'success', icon: '✅', text: 'All systems normal — no alerts', time: 'Just now' }]
        : []),
    ];

    // ── Chart data: first 6 medicines with name + stock ──
    const chartData = medicines.slice(0, 6).map(m => ({
      name:  m.name,
      stock: m.stock,
      color: m.stock < 20 ? '#ef4444' : null, // red if low, frontend picks color otherwise
    }));

    // ── Recent inventory: last 5 added (for dashboard table) ──
    const recentInventory = medicines.slice(0, 5).map(m => ({
      _id:      m._id,
      name:     m.name,
      company:  m.company,
      stock:    m.stock,
      price:    m.price,
      expiry:   m.expiry,
      isLowStock: m.stock < 20,
    }));

    res.json({
      success: true,
      data: {
        // ── Stat cards ──
        cards: {
          totalMedicines:    medicines.length,
          totalRequests:     requests.length,
          totalReservations: reservations.length,
          lowStock:          lowStockMedicines.length,
          pendingRequests:   pendingRequests.length,
          upcomingReservations: upcomingReservations.length,
          pastReservations:  pastReservations.length,
        },

        // ── Chart ──
        chartData,

        // ── Notifications panel ──
        notifications,

        // ── Recent inventory table ──
        recentInventory,

        // ── Low stock list (for alert banner) ──
        lowStockList: lowStockMedicines.map(m => ({
          _id: m._id, name: m.name, stock: m.stock,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
