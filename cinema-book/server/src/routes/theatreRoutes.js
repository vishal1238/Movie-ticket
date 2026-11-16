const express = require('express');
const { getTheatres, createTheatre } = require('../controllers/theatreController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getTheatres)
  .post(protect, admin, createTheatre);

module.exports = router;
