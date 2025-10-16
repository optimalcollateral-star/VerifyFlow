const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Verify invoice
router.get('/', [
  // Validate and sanitize input
  body('invoice_number')
    .trim()
    .notEmpty().withMessage('Invoice number is required')
    .isAlphanumeric().withMessage('Invoice number should contain only letters and numbers')
    .escape()
], (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).render('pages/home', {
      title: 'Error',
      errors: errors.array(),
      formData: req.body
    });
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
