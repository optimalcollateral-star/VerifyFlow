const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to check admin access
function requireAdminKey(req, res, next) {
  const adminKey = req.query.key || req.body.key;
  
  if (!process.env.ADMIN_KEY) {
    return res.status(500).send('Admin key not configured on server');
  }
  
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).render('403', {
      title: 'Access Denied',
      message: 'Invalid admin key. Access denied.'
    });
  }
  
  next();
}

// Helper function to sanitize input
function sanitizeInput(input) {
  if (!input) return '';
  return input.trim().substring(0, 255);
}

// Admin dashboard - List all invoices
router.get('/', requireAdminKey, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM invoices ORDER BY created_at DESC'
    );
    
    res.render('admin', {
      title: 'Admin Dashboard',
      invoices: result.rows,
      adminKey: req.query.key
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).send('Error loading admin dashboard');
  }
});

// New invoice form
router.get('/new', requireAdminKey, (req, res) => {
  res.render('admin-new', {
    title: 'Register New Invoice',
    adminKey: req.query.key,
    error: null
  });
});

// Create new invoice
router.post('/create', requireAdminKey, async (req, res) => {
  try {
    const { invoice_number, bank_name, bank_account_number, beneficiary_name } = req.body;
    
    // Validate required fields
    if (!invoice_number || !bank_name || !bank_account_number) {
      return res.render('admin-new', {
        title: 'Register New Invoice',
        adminKey: req.body.key,
        error: 'Invoice number, bank name, and bank account number are required'
      });
    }
    
    // Sanitize inputs
    const sanitizedInvoiceNumber = sanitizeInput(invoice_number);
    const sanitizedBankName = sanitizeInput(bank_name);
    const sanitizedBankAccountNumber = sanitizeInput(bank_account_number);
    const sanitizedBeneficiaryName = sanitizeInput(beneficiary_name);
    
    // Insert into database
    await db.query(
      `INSERT INTO invoices (invoice_number, bank_name, bank_account_number, beneficiary_name) 
       VALUES ($1, $2, $3, $4)`,
      [sanitizedInvoiceNumber, sanitizedBankName, sanitizedBankAccountNumber, sanitizedBeneficiaryName]
    );
    
    res.redirect(`/admin?key=${req.body.key}`);
  } catch (error) {
    console.error('Create invoice error:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.render('admin-new', {
        title: 'Register New Invoice',
        adminKey: req.body.key,
        error: 'Invoice number already exists'
      });
    }
    
    res.status(500).send('Error creating invoice');
  }
});

// Delete invoice
router.post('/delete/:id', requireAdminKey, async (req, res) => {
  try {
    await db.query('DELETE FROM invoices WHERE id = $1', [req.params.id]);
    res.redirect(`/admin?key=${req.body.key}`);
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).send('Error deleting invoice');
  }
});

// Edit invoice form
router.get('/edit/:id', requireAdminKey, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM invoices WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).send('Invoice not found');
    }
    
    res.render('admin-edit', {
      title: 'Edit Invoice',
      invoice: result.rows[0],
      adminKey: req.query.key,
      error: null
    });
  } catch (error) {
    console.error('Edit invoice error:', error);
    res.status(500).send('Error loading invoice');
  }
});

// Update invoice
router.post('/update/:id', requireAdminKey, async (req, res) => {
  try {
    const { invoice_number, bank_name, bank_account_number, beneficiary_name } = req.body;
    
    // Validate required fields
    if (!invoice_number || !bank_name || !bank_account_number) {
      const result = await db.query('SELECT * FROM invoices WHERE id = $1', [req.params.id]);
      return res.render('admin-edit', {
        title: 'Edit Invoice',
        invoice: result.rows[0],
        adminKey: req.body.key,
        error: 'Invoice number, bank name, and bank account number are required'
      });
    }
    
    // Sanitize inputs
    const sanitizedInvoiceNumber = sanitizeInput(invoice_number);
    const sanitizedBankName = sanitizeInput(bank_name);
    const sanitizedBankAccountNumber = sanitizeInput(bank_account_number);
    const sanitizedBeneficiaryName = sanitizeInput(beneficiary_name);
    
    // Update database
    await db.query(
      `UPDATE invoices 
       SET invoice_number = $1, bank_name = $2, bank_account_number = $3, 
           beneficiary_name = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [sanitizedInvoiceNumber, sanitizedBankName, sanitizedBankAccountNumber, 
       sanitizedBeneficiaryName, req.params.id]
    );
    
    res.redirect(`/admin?key=${req.body.key}`);
  } catch (error) {
    console.error('Update invoice error:', error);
    
    if (error.code === '23505') { // Unique violation
      const result = await db.query('SELECT * FROM invoices WHERE id = $1', [req.params.id]);
      return res.render('admin-edit', {
        title: 'Edit Invoice',
        invoice: result.rows[0],
        adminKey: req.body.key,
        error: 'Invoice number already exists'
      });
    }
    
    res.status(500).send('Error updating invoice');
  }
});

module.exports = router;
