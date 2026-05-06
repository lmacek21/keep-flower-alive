const House = require("../models/house.model");

const HouseDao = {
  create: (data) => House.create(data),
  getById: (id) => House.findById(id),
  getAll: () => House.find({}),
  deleteById: (id) => House.findByIdAndDelete(id),
  addMember: (houseId, memberId) =>
    House.findByIdAndUpdate(
      houseId,
      { $addToSet: { members: memberId } },
      { returnDocument: "after" },
    ),
  removeMember: (houseId, memberId) =>
    House.findByIdAndUpdate(
      houseId,
      { $pull: { members: memberId } },
      { returnDocument: "after" },
    ),
};

module.exports = HouseDao;
