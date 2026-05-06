const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Measurement", measurementSchema);
