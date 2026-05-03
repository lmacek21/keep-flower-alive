const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  members: [{ type: String }],
});

module.exports = mongoose.model("House", houseSchema);
