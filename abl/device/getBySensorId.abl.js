const ajv = require("../../utils/ajv.util");
const DeviceDao = require("../../dao/device.dao");
const schema = require("../../schema/device/getBySensorId.schema");

const validate = ajv.compile(schema);

async function getDeviceBySensorId(req, res) {
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
    return res.status(200).json(device);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = getDeviceBySensorId;
