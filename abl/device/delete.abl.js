const ajv = require("../../utils/ajv.util");
const DeviceDao = require("../../dao/device.dao");
const { isOwner } = require("../../utils/authorize.util");
const schema = require("../../schema/device/delete.schema");

const validate = ajv.compile(schema);

async function deleteDevice(req, res) {
  const body = req.body;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const device = await DeviceDao.getById(body.id);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }
    if (!(await isOwner(device.houseId, req.user))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await DeviceDao.deleteById(body.id);
    return res.status(200).json(device);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = deleteDevice;
