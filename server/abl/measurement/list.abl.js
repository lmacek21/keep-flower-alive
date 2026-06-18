const ajv = require("../../utils/ajv.util");
const MeasurementDao = require("../../dao/measurement.dao");
const RoomDao = require("../../dao/room.dao");
const { hasAccess } = require("../../utils/authorize.util");
const schema = require("../../schema/measurement/list.schema");

const validate = ajv.compile(schema);

async function listMeasurements(req, res) {
  const body = req.query;
  if (!validate(body)) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validate.errors });
  }
  try {
    const room = await RoomDao.getById(body.roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    if (!(await hasAccess(room.houseId, req.user))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const endDate = body.endDate ? new Date(body.endDate) : new Date();
    const startDate = body.startDate
      ? new Date(body.startDate)
      : new Date(endDate.getTime() - 24 * 60 * 60 * 1000);

    if (startDate >= endDate) {
      return res
        .status(400)
        .json({ error: "startDate must be before endDate" });
    }

    const measurements = await MeasurementDao.list(body.roomId, startDate, endDate);
    return res.status(200).json(measurements);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
}

module.exports = listMeasurements;
