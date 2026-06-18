const Room = require("../models/room.model");

const RoomDao = {
  create: (data) => Room.create(data),
  getById: (id) => Room.findById(id),
  getByIdWithFlowers: (id) => Room.findById(id).populate("flowers"),
  update: (id, data) => Room.findByIdAndUpdate(id, data, { returnDocument: "after" }),
  deleteById: (id) => Room.findByIdAndDelete(id),
  getByHouseId: (houseId) => Room.find({ houseId }),
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
  removeFlowerFromAllRooms: (flowerId) =>
    Room.updateMany({ flowers: flowerId }, { $pull: { flowers: flowerId } }),
};

module.exports = RoomDao;
