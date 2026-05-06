const express = require("express");
const router = express.Router();

const createDevice = require("../abl/device/create.abl");
const deleteDevice = require("../abl/device/delete.abl");
const listDevices = require("../abl/device/list.abl");

router.post("/create", async (req, res) => {
  await createDevice(req, res);
});

router.delete("/delete", async (req, res) => {
  await deleteDevice(req, res);
});

router.get("/list", async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    req.body = { roomId: req.query?.roomId };
  }
  await listDevices(req, res);
});

module.exports = router;
