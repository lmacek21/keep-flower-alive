const express = require("express");
const router = express.Router();

const createRoom = require("../abl/room/create.abl");
const updateRoom = require("../abl/room/update.abl");
const deleteRoom = require("../abl/room/delete.abl");
const addFlower = require("../abl/room/addFlower.abl");
const removeFlower = require("../abl/room/removeFlower.abl");

router.post("/create", async (req, res) => {
  await createRoom(req, res);
});

router.post("/update", async (req, res) => {
  await updateRoom(req, res);
});

router.delete("/delete", async (req, res) => {
  await deleteRoom(req, res);
});

router.post("/addFlower", async (req, res) => {
  await addFlower(req, res);
});

router.post("/removeFlower", async (req, res) => {
  await removeFlower(req, res);
});

module.exports = router;
