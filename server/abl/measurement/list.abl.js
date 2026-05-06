const ajv = require("../../utils/ajv.util");
const MeasurementDao = require("../../dao/measurement.dao");
const schema = require("../../schema/measurement/list.schema");

const validate = ajv.compile(schema);

async function listMeasurements(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const endDate = body.endDate ? new Date(body.endDate) : new Date();
    const startDate = body.startDate
      ? new Date(body.startDate)
      : new Date(endDate.getTime() - 24 * 60 * 60 * 1000);

    if (startDate >= endDate) {
      return res
        .status(400)
        .json({ error: "startDate must be before endDate" });
    }

    const measurements = await MeasurementDao.list(
      body.roomId,
      startDate,
      endDate,
    );
    return res.status(200).json(measurements);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = listMeasurements;
