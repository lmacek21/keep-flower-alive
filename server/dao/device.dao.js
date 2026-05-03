const Device = require("../models/device.model");

const DeviceDao = {
  create: (data) => Device.create(data),
  deleteById: (id) => Device.findByIdAndDelete(id),
};

module.exports = DeviceDao;
