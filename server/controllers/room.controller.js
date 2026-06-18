const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const loadRoom = require("../abl/room/load.abl");
const createRoom = require("../abl/room/create.abl");
const updateRoom = require("../abl/room/update.abl");
const deleteRoom = require("../abl/room/delete.abl");
const addFlower = require("../abl/room/addFlower.abl");
const removeFlower = require("../abl/room/removeFlower.abl");

router.get("/load", auth, async (req, res) => {
  await loadRoom(req, res);
});

router.post("/create", auth, async (req, res) => {
  await createRoom(req, res);
});

router.post("/update", auth, async (req, res) => {
  await updateRoom(req, res);
});

router.delete("/delete", auth, async (req, res) => {
  await deleteRoom(req, res);
});

router.post("/addFlower", auth, async (req, res) => {
  await addFlower(req, res);
});

router.post("/removeFlower", auth, async (req, res) => {
  await removeFlower(req, res);
});

module.exports = router;
