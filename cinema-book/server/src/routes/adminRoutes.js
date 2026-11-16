const express = require('express');
const { getDashboardStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getDashboardStats);

module.exports = router;
