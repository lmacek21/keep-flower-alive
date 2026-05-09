const HouseDao = require("../dao/house.dao");

async function isOwner(houseId, user) {
  if (user.role === "superuser") return true;
  const house = await HouseDao.getById(houseId);
  if (!house) return false;
  return house.ownerId.toString() === user.id.toString();
}

async function hasAccess(houseId, user) {
  if (user.role === "superuser") return true;
  const house = await HouseDao.getById(houseId);
  if (!house) return false;
  const owner = house.ownerId.toString() === user.id.toString();
  const member = house.members.some((m) => m.toString() === user.id.toString());
  return owner || member;
}

module.exports = { isOwner, hasAccess };
