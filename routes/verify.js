const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper function to get client IP
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         'unknown';
}

// Helper function to sanitize invoice number
function sanitizeInvoiceNumber(invoiceNumber) {
  if (!invoiceNumber) return '';
  // Allow alphanumeric, hyphens, and underscores only
  return invoiceNumber.trim().replace(/[^a-zA-Z0-9\-_]/g, '');
}

// Homepage - Invoice search form
router.get('/', (req, res) => {
  res.render('index', { title: 'Invoice Bank Verification' });
});

// Verify invoice
router.get('/verify', async (req, res) => {
  try {
    const invoiceNumber = sanitizeInvoiceNumber(req.query.invoice);
    
    if (!invoiceNumber) {
      return res.render('result', {
        title: 'Verification Result',
        found: false,
        error: 'Please provide a valid invoice number',
        invoice: null
      });
    }

    // Query database for invoice
    const result = await db.query(
      'SELECT invoice_number, bank_name, bank_account_number, beneficiary_name FROM invoices WHERE invoice_number = $1',
      [invoiceNumber]
    );

    // Log the verification attempt
    const clientIP = getClientIP(req);
    await db.query(
      'INSERT INTO verification_logs (invoice_number, ip_address) VALUES ($1, $2)',
      [invoiceNumber, clientIP]
    );

    if (result.rows.length > 0) {
      // Invoice found
      res.render('result', {
        title: 'Verification Result',
        found: true,
        invoice: result.rows[0],
        error: null
      });
    } else {
      // Invoice not found
      res.render('result', {
        title: 'Verification Result',
        found: false,
        error: 'Invoice not found or not yet registered',
        invoice: null
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).render('500', {
      title: 'Service Error',
      error: 'Service temporarily unavailable. Please try again later.'
    });
  }
});

module.exports = router;
