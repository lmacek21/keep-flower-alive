const Room = require("../models/room.model");

const RoomDao = {
  getById: (id) => Room.findById(id),
  create: (data) => Room.create(data),
  update: (id, data) => Room.findByIdAndUpdate(id, data, { returnDocument: "after" }),
  save: (roomDoc) => roomDoc.save(),
  deleteById: (id) => Room.findByIdAndDelete(id),
  deleteByHouseId: (houseId) => Room.deleteMany({ houseId }),
  getByHouseIdWithFlowers: (houseId) =>
    Room.find({ houseId }).populate("flowers"),
  addFlower: (roomId, flowerId) =>
    Room.findByIdAndUpdate(
      roomId,
      { $addToSet: { flowers: flowerId } },
      { returnDocument: "after" },
    ),
  removeFlower: (roomId, flowerId) =>
    Room.findByIdAndUpdate(
      roomId,
      { $pull: { flowers: flowerId } },
      { returnDocument: "after" },
    ),
};

module.exports = RoomDao;
