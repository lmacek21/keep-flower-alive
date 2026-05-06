const Device = require("../models/device.model");

const DeviceDao = {
  create: (data) => Device.create(data),
  listByRoomId: (roomId) => Device.find({ roomId }),
  deleteById: (id) => Device.findByIdAndDelete(id),
};

module.exports = DeviceDao;
