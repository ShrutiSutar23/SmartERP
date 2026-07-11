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