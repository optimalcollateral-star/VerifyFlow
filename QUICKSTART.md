# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/invoice_verification
ADMIN_KEY=my-secret-admin-key-123
```

### Step 3: Initialize Database
```bash
npm run init-db
```

### Step 4: Start Server
```bash
npm run dev
```

### Step 5: Test the Application

**Public Search:**
- Visit: `http://localhost:3000`
- Try invoice: `INV-2024-001`

**Admin Panel:**
- Visit: `http://localhost:3000/admin?key=my-secret-admin-key-123`
- Create, edit, or delete invoices

## 📦 Sample Test Data

After running `npm run init-db`, these invoices are available:

| Invoice Number | Bank Name | Account Number |
|---------------|-----------|----------------|
| INV-2024-001 | HSBC Bank | 1234567890 |
| INV-2024-002 | Standard Chartered | 9876543210 |
| INV-2024-003 | Citibank | 5555666677 |

## 🔧 Troubleshooting

**Database Connection Error:**
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Verify database exists

**Admin Access Denied:**
- Check `ADMIN_KEY` matches in URL and `.env`
- Format: `/admin?key=YOUR_KEY`

**Port Already in Use:**
- Change `PORT` in `.env` to another port (e.g., 3001)

## 📚 Next Steps

1. Read the full [README.md](README.md) for deployment instructions
2. Review [prd.txt](prd.txt) for product requirements
3. Customize the UI in `views/` directory
4. Add your own invoice data via admin panel

## 🚢 Deploy to Production

**Railway (Recommended):**
```bash
railway login
railway init
railway up
railway run npm run init-db
```

See README.md for detailed deployment instructions.
