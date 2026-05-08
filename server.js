const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',         require('./src/routes/auth'));
app.use('/api/medicines',    require('./src/routes/medicines'));
app.use('/api/requests',     require('./src/routes/requests'));
app.use('/api/reservations', require('./src/routes/reservations'));
app.use('/api/profile',      require('./src/routes/profile'));
app.use('/api/dashboard',    require('./src/routes/dashboard'));

// ── Health check ────────────────────────────────────────────
app.get('/', (_req, res) =>
  res.json({ message: '💊 Pharmacy API is running!', version: '1.0.0' })
);

// ── Global error handler ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

// ── Connect & Listen ────────────────────────────────────────
const PORT     = process.env.PORT      || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pharmacy_db';
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server → http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB failed:', err.message);
    process.exit(1);
  });
