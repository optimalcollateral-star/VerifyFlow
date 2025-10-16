const express = require('express');
const router = express.Router();

// Verify invoice
router.get('/', (req, res) => {
  if (!req.query.invoice_number) {
    return res.redirect('/');
  }

  // TODO: Replace with actual database query
  const mockInvoice = {
    invoice_number: req.query.invoice_number,
    bank_name: 'Sample Bank',
    bank_account_number: 'XXXX-XXXX-XXXX-1234',
    beneficiary_name: 'Sample Beneficiary',
    created_at: new Date().toISOString()
  };

  res.render('pages/result', {
    title: 'Verification Result',
    invoice: mockInvoice,
    verified: true
  });
});

module.exports = router;
