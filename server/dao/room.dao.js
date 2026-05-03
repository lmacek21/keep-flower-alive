const Room = require("../models/room.model");

const RoomDao = {
  create: (data) => Room.create(data),
  update: (id, data) => Room.findByIdAndUpdate(id, data, { returnDocument: "after" }),
  deleteById: (id) => Room.findByIdAndDelete(id),
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
