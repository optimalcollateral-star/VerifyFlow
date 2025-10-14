# Invoice Bank Verification Web App - MVP

A secure web application for verifying bank account details via invoice numbers to prevent wire transfer fraud in international trade.

## 🎯 Overview

This application enables users to verify bank account information associated with invoice numbers, reducing the risk of payment fraud. It features a public verification interface and a protected admin panel for managing invoice records.

## ✨ Features

- **Invoice Verification**: Search by invoice number to retrieve verified bank details
- **Admin Dashboard**: Secure CRUD operations for invoice management
- **Audit Logging**: All verification attempts are logged with IP and timestamp
- **Security**: Parameterized SQL queries, input sanitization, admin key protection
- **Modern UI**: Clean, responsive interface with professional styling

## 🛠 Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Template Engine**: EJS
- **Deployment**: Railway (backend + DB) / Vercel (optional)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd VerifyFlow
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/invoice_verification
ADMIN_KEY=your-secure-admin-key
```

### 3. Initialize Database

```bash
npm run init-db
```

This creates the required tables and inserts sample data for testing.

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
VerifyFlow/
├── server.js              # Express server entry point
├── db.js                  # PostgreSQL connection pool
├── schema.sql             # Database schema
├── package.json           # Dependencies
├── .env.example           # Environment template
├── routes/
│   ├── verify.js          # Public verification routes
│   └── admin.js           # Admin CRUD routes
├── views/
│   ├── index.ejs          # Homepage (search form)
│   ├── result.ejs         # Verification results
│   ├── admin.ejs          # Admin dashboard
│   ├── admin-new.ejs      # Create invoice form
│   ├── admin-edit.ejs     # Edit invoice form
│   ├── 404.ejs            # Not found page
│   ├── 500.ejs            # Error page
│   └── 403.ejs            # Access denied page
└── scripts/
    └── init-db.js         # Database initialization
```

## 🔐 Admin Access

Access the admin panel at:
```
http://localhost:3000/admin?key=YOUR_ADMIN_KEY
```

Replace `YOUR_ADMIN_KEY` with the value from your `.env` file.

## 🗄 Database Schema

### invoices
- `id` - Primary key
- `invoice_number` - Unique invoice identifier
- `bank_name` - Bank name
- `bank_account_number` - Account number
- `beneficiary_name` - Optional beneficiary
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### verification_logs
- `id` - Primary key
- `invoice_number` - Searched invoice
- `ip_address` - Client IP
- `verified_at` - Search timestamp

## 🚢 Deployment

### Railway (Recommended)

1. **Create Railway Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and initialize
   railway login
   railway init
   ```

2. **Add PostgreSQL Database**
   - Go to Railway dashboard
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the `DATABASE_URL` from variables

3. **Set Environment Variables**
   ```bash
   railway variables set ADMIN_KEY=your-secure-key
   railway variables set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Initialize Database**
   ```bash
   railway run npm run init-db
   ```

### Vercel (Alternative)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to Vercel dashboard → Settings → Environment Variables
   - Add `DATABASE_URL` and `ADMIN_KEY`

## 🔒 Security Features

- **SQL Injection Prevention**: All queries use parameterized statements
- **Input Sanitization**: User inputs are validated and sanitized
- **Admin Protection**: Admin routes require secret key
- **Audit Trail**: All verification attempts logged
- **Error Handling**: No sensitive information exposed in errors

## 📝 API Endpoints

### Public Routes
- `GET /` - Homepage with search form
- `GET /verify?invoice=XXX` - Verify invoice and display results

### Admin Routes (require `?key=ADMIN_KEY`)
- `GET /admin` - Dashboard with all invoices
- `GET /admin/new` - New invoice form
- `POST /admin/create` - Create invoice
- `GET /admin/edit/:id` - Edit invoice form
- `POST /admin/update/:id` - Update invoice
- `POST /admin/delete/:id` - Delete invoice

## 🧪 Testing

Sample invoices are created during database initialization:
- `INV-2024-001` - HSBC Bank
- `INV-2024-002` - Standard Chartered
- `INV-2024-003` - Citibank

## 🔧 Development Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm run init-db    # Initialize/reset database
```

## 🎯 Future Enhancements

- User authentication system
- SWIFT/IBAN API integration
- REST API for external systems
- Analytics dashboard
- Multi-language support
- Rate limiting and CAPTCHA

## 📄 License

ISC

## 👤 Author

Invoice Bank Verification System - Preventing wire transfer fraud in international trade.

---

For questions or support, please open an issue in the repository.
