# SmartERP — Business Management System

A full-stack ERP (Enterprise Resource Planning) system built from scratch, inspired by Tally software. SmartERP helps businesses manage their accounts, inventory, sales, purchases, and reports — all from one place.

## 🌐 Live Demo

- **Frontend (Live App):** https://smart-erp-wine-eta.vercel.app
- **Backend API:** https://smarterp-q4x1.onrender.com

## 👩‍💻 Built By

**Shruti Sutar**
Non-technical student | Built this project from scratch over 5 weeks

---

## 📌 What is SmartERP?

SmartERP is a web-based accounting and inventory management system similar to Tally. It allows business owners to:

- Manage multiple companies from one account
- Track customers and suppliers (Ledgers)
- Manage stock items with HSN codes, units, and GST
- Record sales and purchase transactions
- Track payment status (Cash, UPI, Bank Transfer, Card)
- Auto-generate PDF invoices
- View real-time business reports
- Navigate using keyboard shortcuts (like Tally)

---

## 🗂️ Project Structure

SmartERP/
│
├── backend/                          # Python Flask Backend
│   ├── app.py                        # Main Flask application entry point
│   ├── models.py                     # Database table definitions (9 tables)
│   ├── routes.py                     # All API routes (15+ endpoints)
│   ├── extensions.py                 # Database extension (SQLAlchemy)
│   ├── invoice_generator.py          # PDF invoice generation (ReportLab)
│   ├── requirements.txt              # Python dependencies
│   ├── Procfile                      # Render deployment config
│   └── .env                          # Environment variables (not in GitHub)
│
├── frontend/                         # Next.js React Frontend
│   ├── app/
│   │   ├── page.js                   # Gateway screen (main menu)
│   │   ├── layout.js                 # Root layout
│   │   ├── config.js                 # API URL configuration
│   │   ├── globals.css               # Global styles
│   │   ├── login/page.js             # Login page
│   │   ├── signup/page.js            # Signup page
│   │   ├── companies/page.js         # Company selection
│   │   ├── ledgers/page.js           # Customer & Supplier ledgers
│   │   ├── items/page.js             # Stock items management
│   │   ├── units/page.js             # Units of measure
│   │   ├── sales/page.js             # Sales voucher
│   │   ├── purchases/page.js         # Purchase voucher
│   │   ├── payment/page.js           # Payment voucher
│   │   ├── receipt/page.js           # Receipt voucher
│   │   ├── journal/page.js           # Journal voucher
│   │   ├── contra/page.js            # Contra voucher
│   │   ├── vouchers/page.js          # All vouchers combined
│   │   ├── stock-summary/page.js     # Stock summary (Inwards/Outwards)
│   │   └── reports/page.js           # Business reports
│   │
│   ├── app/components/
│   │   ├── AppLayout.js              # Main layout wrapper
│   │   ├── KeyboardShortcuts.js      # Global keyboard navigation
│   │   └── ShortcutPanel.js          # Tally-style shortcut sidebar
│   │
│   ├── next.config.js                # Next.js configuration
│   └── package.json                  # Node.js dependencies
│
└── README.md                         # This file

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Python 3.12 | Programming language |
| Flask | Web framework |
| SQLAlchemy | Database ORM |
| PostgreSQL (Supabase) | Cloud database |
| Flask-JWT-Extended | Authentication (JWT tokens) |
| ReportLab | PDF invoice generation |
| Gunicorn | Production server |
| Flask-CORS | Cross-origin requests |

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 | React framework |
| React 19 | UI library |
| Tailwind CSS | Styling |
| JavaScript | Programming language |

### Deployment
| Service | What it hosts |
|---|---|
| Supabase | PostgreSQL database (cloud) |
| Render | Flask backend API |
| Vercel | Next.js frontend |
| GitHub | Source code & version control |

---

## 🗄️ Database Structure

The application uses **9 database tables**:
user          → Stores login credentials
company       → Business companies (up to 5 per user)
customer      → Customer ledgers (debtors)
supplier      → Supplier ledgers (creditors)
item          → Stock items with HSN, units, prices
sale          → Sales transactions
purchase      → Purchase transactions
voucher       → Payment, Receipt, Journal, Contra vouchers
unit          → Units of measurement (KG, Ltr, PCS etc.)


---

## ⌨️ Keyboard Shortcuts (Tally-Style)

| Shortcut | Action |
|---|---|
| Fn + F8 | Open Sales Voucher |
| Fn + F9 | Open Purchase Voucher |
| Fn + F10 | Open All Vouchers |
| Ctrl + Shift + D | Go to Dashboard/Gateway |
| Ctrl + Shift + C | Go to Company Selection |
| Ctrl + Shift + S | Go to Sales |
| Ctrl + Shift + P | Go to Purchases |
| Ctrl + Shift + I | Go to Items |
| Ctrl + Shift + R | Go to Reports |
| Ctrl + Shift + T | Go to Stock Summary |
| Ctrl + Shift + L | Go to Ledgers |
| Ctrl + Shift + B | Payment Voucher |
| Ctrl + Shift + E | Receipt Voucher |
| Ctrl + Shift + J | Journal Voucher |
| Ctrl + Shift + N | Contra Voucher |
| Ctrl + Shift + Q | Logout |
| ESC | Go Back to Gateway |

---

## ✨ Key Features

### 1. Multi-Company Support
- One account can manage up to 5 companies
- Each company has completely separate data
- Switch between companies instantly

### 2. Masters Management
- **Ledgers** — Create customer (debtor) and supplier (creditor) accounts
- **Stock Items** — Add items with HSN code, unit, purchase price, selling price, GST %
- **Units of Measure** — PCS, KG, Gm, Ltr, Mtr, Pairs, BOX

### 3. Voucher System
- **Sales Voucher (F8)** — Record sales with payment method
- **Purchase Voucher (F9)** — Record purchases with payment method
- **Payment Voucher** — Record payments made
- **Receipt Voucher** — Record payments received
- **Journal Voucher** — Internal adjustments
- **Contra Voucher** — Cash/Bank transfers
- **Auto-voucher** — When a sale/purchase is marked as paid, receipt/payment voucher is created automatically

### 4. Payment Tracking
- Mark transactions as Paid or Unpaid
- Payment methods: Cash, UPI, Bank Transfer, Card
- Outstanding balances tracked automatically
- Color-coded status badges (Green = Paid, Red = Unpaid)

### 5. Inventory Management
- Real-time stock tracking
- Low stock alerts (highlighted in red when below 10 units)
- Stock Summary with Inwards, Outwards, and Closing Balance

### 6. PDF Invoice Generation
- Professional invoices generated automatically for every sale
- Includes company details, customer details, items, and totals
- One-click download

### 7. Reports Dashboard
- Sales Report with grand total
- Purchase Report with grand total
- Stock Summary with stock values
- Customer Outstanding balances
- Business summary cards (Total Sales, Purchases, Customers, Suppliers)

### 8. Keyboard Navigation
- Complete Tally-style keyboard shortcuts
- Clickable shortcut panel on every page
- F-key navigation for vouchers
- No mouse required for core operations

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/ShrutiSutar23/SmartERP.git
cd SmartERP/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo DATABASE_URL=your_supabase_url > .env
echo JWT_SECRET_KEY=your_secret_key >> .env

# Run the backend
python app.py
```

### Frontend Setup
```bash
cd SmartERP/frontend

# Install dependencies
npm install

# Run the frontend
npm run dev
```

### Access the app
- Frontend: http://localhost:3000
- Backend API: http://127.0.0.1:5000

---

## 📈 Development Journey

This project was built **day by day** over 5 weeks:

| Week | What was built |
|---|---|
| Week 1 | Project setup, Flask backend, Database design, Basic CRUD |
| Week 2 | Authentication (JWT), Company management, Sales & Purchase vouchers |
| Week 3 | Frontend (Next.js), API integration, Multi-company isolation |
| Week 4 | Stock Summary, Reports, PDF Invoices, Keyboard shortcuts |
| Week 5 | Payment tracking, Auto-vouchers, Deployment (Render + Vercel) |

---

## 🙏 Acknowledgements

- Built with guidance and learning from real-world ERP concepts
- Inspired by **Tally ERP** software used by millions of businesses in India
- Database hosted on **Supabase** (free tier)
- Application deployed on **Vercel** and **Render** (free tier)

---

## 📞 Contact

**Shruti Sutar**
GitHub: [@ShrutiSutar23](https://github.com/ShrutiSutar23)