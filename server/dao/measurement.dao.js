const Measurement = require("../models/measurement.model");

const MeasurementDao = {
    create: (data) => Measurement.create(data),

    getByMeasurementId: (measurementId) =>
        Measurement.findOne({ measurementId }),

    getLatest: (roomId) =>
        Measurement.findOne({ roomId }).sort({ measuredAt: -1 }),

    list: (roomId, startDate, endDate) =>
        Measurement.find({
            roomId,
            measuredAt: { $gte: startDate, $lte: endDate },
        }).sort({ measuredAt: -1 }),
};

module.exports = MeasurementDao;