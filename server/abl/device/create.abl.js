const ajv = require("../../utils/ajv.util");
const DeviceDao = require("../../dao/device.dao");
const HouseDao = require("../../dao/house.dao");
const schema = require("../../schema/device/create.schema");

const validate = ajv.compile(schema);

async function createDevice(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  const houseId = req.gateway.houseId;
  try {
    const house = await HouseDao.getById(houseId);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }
    const existing = await DeviceDao.getBySensorId(body.sensorId);
    if (existing) {
      return res.status(409).json({ error: "Device already registered" });
    }
    const device = await DeviceDao.create({
      sensorId: body.sensorId,
      houseId,
    });
    return res.status(200).json({ id: device._id, sensorId: device.sensorId, houseId: device.houseId });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = createDevice;
