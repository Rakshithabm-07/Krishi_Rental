# 🌾 Krishi Rental System — Test-Ready Build (SQLite)

This version uses **SQLite** (no MySQL setup needed) so you can run and test
the entire app immediately. Switch to MySQL for production.

## ▶️ Run Immediately (Windows)

```cmd
cd krishi_test
pip install flask werkzeug
python app.py
```

Open: http://localhost:5000

## 🔑 Default Login

| Role  | Email            | Password |
| ----- | ---------------- | -------- |
| Admin | admin@krishi.com | admin123 |

## 🧪 Full Test Flow

### Step 1 – Admin

1. Login → Role: Admin | admin@krishi.com / admin123
2. Add Producer → fill name, email, password, phone, address
3. View Producers tab to confirm

### Step 2 – Producer

1. Login → Role: Producer (email/password you just created)
2. Add Equipment → name, rent/day, qty, max days, deposit
3. Add QC Person → name, email, phone, password
4. View Equipments and View QC tabs to confirm

### Step 3 – Farmer

1. Signup as Farmer from the home page
2. Login → Role: Farmer
3. All Equipments → click RENT on any item
4. Fill rental days, to-date, payment mode → Make Payment
5. My Rentals → click Return when ready

### Step 4 – QC Person

1. Login → Role: Quality Checker (email/password producer created)
2. Quality Check tab → see the return request
3. Click Accept (or Reject), enter damage fine → Submit

## 📁 Structure

```
krishi_test/
├── app.py                    ← Entry point (creates DB on first run)
├── krishi_test.db            ← Auto-created SQLite database
├── backend/
│   ├── config/db.py          ← SQLite layer (swap for MySQL in production)
│   └── routes/               ← auth, admin, producer, farmer, qc
└── frontend/
    ├── templates/            ← index.html, dashboard.html
    └── static/css,js/        ← style.css, home.js, dashboard.js
```

## 🔄 Switch to MySQL (Production)

Replace `backend/config/db.py` with the MySQL version from `krishi_rental/`
and update your password. Run `schema.sql` to create the database.
