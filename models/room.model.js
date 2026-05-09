const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "House",
    required: true,
  },
  name: { type: String, required: true },
  flowers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flower" }],
});

module.exports = mongoose.model("Room", roomSchema);
