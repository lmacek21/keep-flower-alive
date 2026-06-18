const House = require("../models/house.model");

const HouseDao = {
  create: (data) => House.create(data),
  getById: (id) => House.findById(id),
  getByIdWithSecret: (id) => House.findById(id).select("+secret"),
  getBySecret: (secret) => House.findOne({ secret }),
  getByOwnerId: (ownerId) => House.findOne({ "owner.id": ownerId }),
  getAll: () => House.find({}),
  listByUserId: (userId) =>
    House.find({ $or: [{ "owner.id": userId }, { "members.id": userId }] }),
  addMember: (houseId, memberObj) =>
    House.findByIdAndUpdate(
      houseId,
      { $addToSet: { members: memberObj } },
      { returnDocument: "after" },
    ),
  removeMember: (houseId, memberId) =>
    House.findByIdAndUpdate(
      houseId,
      { $pull: { members: { id: memberId } } },
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
