const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  status: { type: String },
});

module.exports = mongoose.model("Device", deviceSchema);
