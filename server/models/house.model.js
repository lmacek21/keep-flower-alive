const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  ownerId: { type: String, default: "" },
  members: [{ type: String }],
});

module.exports = mongoose.model("House", houseSchema);
