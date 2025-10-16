const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Admin Dashboard
router.get('/', (req, res) => {
  // TODO: Replace with actual database query
  const mockInvoices = [
    {
      id: 1,
      invoice_number: 'INV-2023-001',
      bank_name: 'Sample Bank',
      bank_account_number: 'XXXX-XXXX-XXXX-1234',
      beneficiary_name: 'Sample Beneficiary',
      created_at: new Date().toISOString()
    }
  ];

  res.render('pages/admin/dashboard', {
    title: 'Admin Dashboard',
    invoices: mockInvoices
  });
});

// Show new invoice form
router.get('/new', (req, res) => {
  res.render('pages/admin/new-invoice', {
    title: 'Add New Invoice',
    formData: {}
  });
});

// Create new invoice
router.post('/', [
  // Validate and sanitize input
  body('invoice_number')
    .trim()
    .notEmpty().withMessage('Invoice number is required')
    .isAlphanumeric().withMessage('Invoice number should contain only letters and numbers')
    .escape(),
  body('bank_name')
    .trim()
    .notEmpty().withMessage('Bank name is required')
    .escape(),
  body('bank_account_number')
    .trim()
    .notEmpty().withMessage('Bank account number is required')
    .escape(),
  body('beneficiary_name')
    .trim()
    .optional({ checkFalsy: true })
    .escape()
], (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).render('pages/admin/new-invoice', {
      title: 'Add New Invoice',
      errors: errors.array(),
      formData: req.body
    });
  }

  // TODO: Save to database
  console.log('New invoice data:', req.body);
  
  res.redirect('/admin');
});

// Edit invoice form
router.get('/:id/edit', (req, res) => {
  // TODO: Fetch invoice from database
  const invoice = {
    id: req.params.id,
    invoice_number: 'INV-2023-001',
    bank_name: 'Sample Bank',
    bank_account_number: 'XXXX-XXXX-XXXX-1234',
    beneficiary_name: 'Sample Beneficiary'
  };

  res.render('pages/admin/edit-invoice', {
    title: 'Edit Invoice',
    invoice: invoice
  });
});

// Update invoice
router.post('/:id', [
  // Same validation as create
], (req, res) => {
  // Similar to create but with ID
  // TODO: Update in database
  console.log('Update invoice:', req.params.id, req.body);
  res.redirect('/admin');
});

// Delete invoice
router.post('/:id/delete', (req, res) => {
  // TODO: Delete from database
  console.log('Delete invoice:', req.params.id);
  res.redirect('/admin');
});

module.exports = router;
