# 💊 Pharmacy Dashboard — Backend API

Node.js + Express + MongoDB REST API built to match your pharmacy frontend exactly.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env` (already created for you):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pharmacy_db
JWT_SECRET=pharmacy_super_secret_key_change_in_production
JWT_EXPIRE=7d
```

### 3. Seed the database
Loads your 5 default medicines + admin account:
```bash
npm run seed
```

### 4. Start the server
```bash
npm run dev    # development (auto-restart)
npm start      # production
```
Server → **http://localhost:5000**

---

## 🔐 Authentication

All routes require a JWT token in the header:
```
Authorization: Bearer <your_token>
```
Get the token by calling `POST /api/auth/login`.

---

## 📋 API Endpoints

### Auth `/api/auth`
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/register` | name, email, password |
| POST | `/login` | email, password |
| GET  | `/me` | — (token required) |
| PUT  | `/change-password` | currentPassword, newPassword |

### Medicines `/api/medicines`
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/` | All medicines |
| GET | `/?search=panadol` | Search by name or company |
| GET | `/?filter=low` | Stock < 20 |
| GET | `/?filter=ok` | Stock >= 20 |
| GET | `/low-stock` | Low stock list |
| POST | `/` | Add medicine |
| PUT | `/:id` | Edit medicine |
| DELETE | `/:id` | Delete medicine |

**Body fields:** `name`, `company`, `price`, `stock`, `expiry`, `category`, `description`

### Requests `/api/requests`
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/` | All requests |
| POST | `/` | Add request |
| DELETE | `/:id` | Delete request |
| PUT | `/:id/status` | Update status |

**Body fields:** `name` (patient), `medicine`, `phone`

### Reservations `/api/reservations`
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/` | All reservations |
| POST | `/` | Add reservation |
| DELETE | `/:id` | Cancel reservation |
| PUT | `/:id/status` | Update status |

**Body fields:** `name` (customer), `medicine`, `date` (YYYY-MM-DD)

### Profile `/api/profile`
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/` | Get profile |
| PUT | `/` | Save profile |

**Body fields:** `name`, `email`, `phone`, `pharmacy`, `location`

### Dashboard `/api/dashboard`
| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/` | cards, chartData, notifications, recentInventory, lowStockList |

---

## 🗂 Project Structure

```
pharmacy-backend/
├── server.js
├── seed.js
├── .env
└── src/
    ├── middleware/auth.js
    ├── models/
    │   ├── User.js          (name, email, phone, pharmacy, location)
    │   ├── Medicine.js      (name, company, price, stock, expiry, category)
    │   ├── Request.js       (name, medicine, phone, status)
    │   └── Reservation.js   (name, medicine, date, status)
    ├── controllers/
    │   ├── authController.js
    │   ├── medicineController.js
    │   ├── requestController.js
    │   ├── reservationController.js
    │   ├── profileController.js
    │   └── dashboardController.js
    └── routes/
        ├── auth.js
        ├── medicines.js
        ├── requests.js
        ├── reservations.js
        ├── profile.js
        └── dashboard.js
```

---

## 👤 Default Login (after running seed)
```
Email:    admin@medfinder.com
Password: admin123
```

---

## 🔗 Connect Frontend to Backend

Replace `localStorage` in your React pages with API calls:

```js
// Old way (localStorage)
const medicines = JSON.parse(localStorage.getItem("medicines")) || [];

// New way (API)
const token = localStorage.getItem("token"); // store token on login
const res = await fetch("http://localhost:5000/api/medicines", {
  headers: { Authorization: `Bearer ${token}` }
});
const { data: medicines } = await res.json();
```
