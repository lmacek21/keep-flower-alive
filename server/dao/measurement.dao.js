const Measurement = require("../models/measurement.model");

const MeasurementDao = {
  create: (data) => Measurement.create(data),
  getLatest: (roomId) =>
    Measurement.findOne({ roomId }).sort({ measuredAt: -1 }),
  list: (roomId, startDate, endDate) =>
    Measurement.find({
      roomId,
      measuredAt: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
    }).sort({ measuredAt: -1 }),
  deleteByRoomId: (roomId) => Measurement.deleteMany({ roomId }),
};

module.exports = MeasurementDao;
