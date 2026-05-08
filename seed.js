// seed.js — populates MongoDB with the same default data your frontend uses
// Run with: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User        = require('./src/models/User');
const Medicine    = require('./src/models/Medicine');
const Request     = require('./src/models/Request');
const Reservation = require('./src/models/Reservation');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pharmacy_db';

const defaultMedicines = [
  { name: 'Panadol',   company: 'GSK',    price: 50,  stock: 120, expiry: '2027-02-10', category: 'Painkiller' },
  { name: 'Augmentin', company: 'GSK',    price: 320, stock: 18,  expiry: '2026-08-15', category: 'Antibiotic' },
  { name: 'Brufen',    company: 'Abbott', price: 90,  stock: 80,  expiry: '2026-12-01', category: 'Painkiller' },
  { name: 'Disprin',   company: 'Bayer',  price: 30,  stock: 9,   expiry: '2026-06-20', category: 'Painkiller' },
  { name: 'Calpol',    company: 'GSK',    price: 110, stock: 55,  expiry: '2027-01-15', category: 'Painkiller' },
];

const defaultRequests = [
  { name: 'Ali Hassan',  medicine: 'Panadol',   phone: '+92 300 1111111' },
  { name: 'Sara Ahmed',  medicine: 'Augmentin', phone: '+92 321 2222222' },
  { name: 'Usman Malik', medicine: 'Brufen',    phone: '+92 333 3333333' },
];

const defaultReservations = [
  { name: 'Fatima Khan',  medicine: 'Calpol',  date: '2026-04-20' },
  { name: 'Bilal Akhtar', medicine: 'Disprin', date: '2026-04-15' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear all collections
    await Promise.all([
      User.deleteMany(),
      Medicine.deleteMany(),
      Request.deleteMany(),
      Reservation.deleteMany(),
    ]);
    console.log('🗑  Cleared existing data');

    // Hash password manually and save directly (bypasses pre-save hook)
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.collection.insertOne({
      name:      'Dr. Ahmed Khan',
      email:     'admin@medfinder.com',
      password:  hashedPassword,
      role:      'admin',
      phone:     '+92 300 1234567',
      pharmacy:  'MedFinder Pharmacy',
      location:  'Lahore, Pakistan',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const adminId = admin.insertedId;
    console.log('👤 Admin created');

    await Medicine.insertMany(defaultMedicines.map(m => ({ ...m, addedBy: adminId })));
    console.log('💊 5 medicines seeded');

    await Request.insertMany(defaultRequests.map(r => ({ ...r, status: 'pending', createdBy: adminId })));
    console.log('📋 3 requests seeded');

    await Reservation.insertMany(defaultReservations.map(r => ({ ...r, status: 'active', createdBy: adminId })));
    console.log('📅 2 reservations seeded');

    console.log('\n🎉 Seed complete!');
    console.log('─────────────────────────────────');
    console.log('  Email:    admin@medfinder.com');
    console.log('  Password: admin123');
    console.log('─────────────────────────────────\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
