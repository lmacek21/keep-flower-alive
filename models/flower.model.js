const mongoose = require("mongoose");

const flowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  minTemp: { type: Number },
  maxTemp: { type: Number },
  image: { type: String },
});

module.exports = mongoose.model("Flower", flowerSchema);
