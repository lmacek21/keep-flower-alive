const ajv = require("../../utils/ajv.util");
const MeasurementDao = require("../../dao/measurement.dao");
const DeviceDao = require("../../dao/device.dao");
const schema = require("../../schema/measurement/create.schema");

const validate = ajv.compile(schema);

async function createMeasurement(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const device = await DeviceDao.getBySensorId(body.sensorId);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }
    if (!device.roomId) {
      return res
        .status(400)
        .json({ error: "Device is not assigned to a room" });
    }
    const measurement = await MeasurementDao.create({
      roomId: device.roomId,
      value: body.temperature,
      measuredAt: body.measuredAt,
      unit: "C",
    });
    return res.status(200).json(measurement);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = createMeasurement;
