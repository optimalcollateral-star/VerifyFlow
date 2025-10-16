const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db } = require('../db');

// Admin Dashboard - List all invoices
router.get('/', async (req, res, next) => {
  try {
    const invoices = await db('invoices')
      .orderBy('created_at', 'desc');

    res.render('pages/admin/dashboard', {
      title: 'Admin Dashboard',
      invoices: invoices.map(invoice => ({
        ...invoice,
        created_at: new Date(invoice.created_at).toLocaleString()
      }))
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    next(error);
  }
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
  body('invoice_number')
    .trim()
    .notEmpty().withMessage('Invoice number is required')
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
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/admin/new-invoice', {
        title: 'Add New Invoice',
        errors: errors.array(),
        formData: req.body
      });
    }

    const { invoice_number, bank_name, bank_account_number, beneficiary_name } = req.body;

    // Check if invoice number already exists
    const existingInvoice = await db('invoices')
      .where({ invoice_number })
      .first();

    if (existingInvoice) {
      return res.status(400).render('pages/admin/new-invoice', {
        title: 'Add New Invoice',
        errors: [{ msg: 'An invoice with this number already exists' }],
        formData: req.body
      });
    }

    // Insert new invoice
    await db('invoices').insert({
      invoice_number,
      bank_name,
      bank_account_number,
      beneficiary_name: beneficiary_name || null
    });

    req.flash('success', 'Invoice created successfully');
    res.redirect('/admin');
  } catch (error) {
    console.error('Error creating invoice:', error);
    next(error);
  }
});

// Edit invoice form
router.get('/:id/edit', async (req, res, next) => {
  try {
    const invoice = await db('invoices')
      .where({ id: req.params.id })
      .first();

    if (!invoice) {
      return res.status(404).render('errors/404', { title: 'Invoice Not Found' });
    }

    res.render('pages/admin/edit-invoice', {
      title: 'Edit Invoice',
      invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    next(error);
  }
});

// Update invoice
router.post('/:id', [
  body('invoice_number')
    .trim()
    .notEmpty().withMessage('Invoice number is required')
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
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/admin/edit-invoice', {
        title: 'Edit Invoice',
        errors: errors.array(),
        invoice: { ...req.body, id: req.params.id }
      });
    }

    const { invoice_number, bank_name, bank_account_number, beneficiary_name } = req.body;

    // Check if invoice number is already taken by another invoice
    const existingInvoice = await db('invoices')
      .where('id', '!=', req.params.id)
      .andWhere({ invoice_number })
      .first();

    if (existingInvoice) {
      return res.status(400).render('pages/admin/edit-invoice', {
        title: 'Edit Invoice',
        errors: [{ msg: 'An invoice with this number already exists' }],
        invoice: { ...req.body, id: req.params.id }
      });
    }

    // Update the invoice
    await db('invoices')
      .where({ id: req.params.id })
      .update({
        invoice_number,
        bank_name,
        bank_account_number,
        beneficiary_name: beneficiary_name || null,
        updated_at: db.fn.now()
      });

    req.flash('success', 'Invoice updated successfully');
    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating invoice:', error);
    next(error);
  }
});

// Delete invoice
router.post('/:id/delete', async (req, res, next) => {
  try {
    await db('invoices')
      .where({ id: req.params.id })
      .delete();

    req.flash('success', 'Invoice deleted successfully');
    res.redirect('/admin');
  } catch (error) {
    console.error('Error deleting invoice:', error);
    next(error);
  }
});

module.exports = router;
