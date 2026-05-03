const Measurement = require("../models/measurement.model");

const MeasurementDao = {
  create: (data) => Measurement.create(data),
  getLatest: (roomId) =>
    Measurement.findOne({ roomId }).sort({ createdAt: -1 }),
  list: (roomId, startDate, endDate) =>
    Measurement.find({
      roomId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 }),
};

module.exports = MeasurementDao;
