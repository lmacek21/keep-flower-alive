const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
  owner: {
    id:    { type: String, required: true },
    email: { type: String, required: true },
  },
  members: [{ id: { type: String }, email: { type: String } }],
  secret: { type: String, required: true, select: false, unique: true },
});

module.exports = mongoose.model("House", houseSchema);
