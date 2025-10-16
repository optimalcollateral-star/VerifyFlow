const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('pages/home', { 
    title: 'Invoice Bank Verification',
    message: 'Verify bank account details using invoice number',
    formData: { invoice_number: '' } // Initialize formData
  });
});

module.exports = router;
