const Show = require('../models/Show');

exports.getShowsByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    let query = { movie: movieId };
    if (date) {
      query.showDate = date;
    }

    const shows = await Show.find(query)
      .populate('theatre', 'name location city totalScreens')
      .populate('movie', 'title duration rating posterUrl language')
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({
      success: true,
      count: shows.length,
      data: shows
    });
  } catch (error) {
    next(error);
  }
};

exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('theatre', 'name location city')
      .populate('movie', 'title duration rating posterUrl bannerUrl language genre');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    res.status(200).json({
      success: true,
      data: show
    });
  } catch (error) {
    next(error);
  }
};

exports.createShow = async (req, res, next) => {
  try {
    const show = await Show.create(req.body);
    const populatedShow = await Show.findById(show._id)
      .populate('theatre', 'name location city')
      .populate('movie', 'title');

    res.status(201).json({
      success: true,
      message: 'Show scheduled successfully',
      data: populatedShow
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Show deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
