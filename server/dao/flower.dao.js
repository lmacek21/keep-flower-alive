const Flower = require("../models/flower.model");

const FlowerDao = {
  create: (data) => Flower.create(data),
  getAll: () => Flower.find({}),
  update: (id, data) => Flower.findByIdAndUpdate(id, data, { returnDocument: "after" }),
  deleteById: (id) => Flower.findByIdAndDelete(id),
};

module.exports = FlowerDao;
