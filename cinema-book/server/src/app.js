const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const connectDB = require('./config/db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB connection for serverless / traditional environments
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'CinemaBook API',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes (Supports both /api prefix and direct serverless paths)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/movies', movieRoutes);
app.use('/movies', movieRoutes);

app.use('/api/theatres', theatreRoutes);
app.use('/theatres', theatreRoutes);

app.use('/api/shows', showRoutes);
app.use('/shows', showRoutes);

app.use('/api/bookings', bookingRoutes);
app.use('/bookings', bookingRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

// Serve frontend build if exists
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Frontend catch-all route (SPA client routing)
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API Route ${req.originalUrl} not found`
    });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('CinemaBook Frontend build not found. Run `npm run build` in client.');
    }
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
