require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');

// Import database connection
const { db, testConnection } = require('./db');

// Import routes
const indexRouter = require('./routes/index');
const verifyRouter = require('./routes/verify');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Test database connection on startup
const initializeApp = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Failed to connect to the database. Exiting...');
      process.exit(1);
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing application:', error);
    process.exit(1);
  }
};

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/verify', verifyRouter);
app.use('/admin', adminRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('errors/404', { title: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500', { title: 'Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
