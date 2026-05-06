const ajv = require("../../utils/ajv.util");
const MeasurementDao = require("../../dao/measurement.dao");
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
    const measurement = await MeasurementDao.create(body);
    return res.status(200).json(measurement);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = createMeasurement;
