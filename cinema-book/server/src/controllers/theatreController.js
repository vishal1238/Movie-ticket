const Theatre = require('../models/Theatre');

exports.getTheatres = async (req, res, next) => {
  try {
    const theatres = await Theatre.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: theatres.length,
      data: theatres
    });
  } catch (error) {
    next(error);
  }
};

exports.createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({
      success: true,
      data: theatre
    });
  } catch (error) {
    next(error);
  }
};
