const ajv = require("../../utils/ajv.util");
const DeviceDao = require("../../dao/device.dao");
const HouseDao = require("../../dao/house.dao");
const { hasAccess } = require("../../utils/authorize.util");
const schema = require("../../schema/device/list.schema");

const validate = ajv.compile(schema);

async function listDevices(req, res) {
  const body = req.query;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const house = await HouseDao.getById(body.houseId);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }
    if (!(await hasAccess(body.houseId, req.user))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const devices = await DeviceDao.listByHouseId(body.houseId);
    return res.status(200).json(devices);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = listDevices;
