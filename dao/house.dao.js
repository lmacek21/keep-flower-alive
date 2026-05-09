const House = require("../models/house.model");

const HouseDao = {
  create: (data) => House.create(data),
  getById: (id) => House.findById(id),
  getAll: () => House.find({}),
  listByUserId: (userId) =>
    House.find({ $or: [{ ownerId: userId }, { members: userId }] }),
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
  setSecret: (houseId, secret) =>
    House.findByIdAndUpdate(
      houseId,
      { secret },
      { returnDocument: "after" },
    ),
};

module.exports = HouseDao;
