const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Verify invoice
router.get('/', async (req, res, next) => {
  try {
    const { invoice_number } = req.query;
    
    if (!invoice_number) {
      return res.redirect('/');
    }

    // Log the verification attempt
    await db('verification_logs').insert({
      invoice_number,
      ip_address: req.ip
    });

    // Find the invoice in the database
    const invoice = await db('invoices')
      .where({ invoice_number })
      .first();

    if (!invoice) {
      return res.render('pages/result', {
        title: 'Verification Result',
        verified: false,
        invoice_number
      });
    }

    res.render('pages/result', {
      title: 'Verification Result',
      invoice: {
        ...invoice,
        created_at: new Date(invoice.created_at).toISOString()
      },
      verified: true
    });
  } catch (error) {
    console.error('Error verifying invoice:', error);
    next(error);
  }
});

module.exports = router;
