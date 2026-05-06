const ajv = require("../../utils/ajv.util");
const MeasurementDao = require("../../dao/measurement.dao");
const schema = require("../../schema/measurement/getLatest.schema");

const validate = ajv.compile(schema);

async function getLatestMeasurement(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const measurement = await MeasurementDao.getLatest(body.roomId);
    if (!measurement) {
      return res.status(404).json({ error: "No measurement found" });
    }
    return res.status(200).json(measurement);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = getLatestMeasurement;
