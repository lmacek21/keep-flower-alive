const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "House",
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: false,
  },
  sensorId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Device", deviceSchema);
