const Device = require("../models/device.model");

const DeviceDao = {
  create: (data) => Device.create(data),
  getById: (id) => Device.findById(id),
  deleteById: (id) => Device.findByIdAndDelete(id),
  getBySensorId: (sensorId) => Device.findOne({ sensorId }),
  listByHouseId: (houseId) => Device.find({ houseId }),
  assignRoom: (id, roomId) =>
    Device.findByIdAndUpdate(id, { roomId }, { returnDocument: "after" }),
};

module.exports = DeviceDao;
