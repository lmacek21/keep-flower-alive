const express = require("express");
const router = express.Router();

const createDevice = require("../abl/device/create.abl");
const deleteDevice = require("../abl/device/delete.abl");

router.post("/create", async (req, res) => {
  await createDevice(req, res);
});

router.delete("/delete", async (req, res) => {
  await deleteDevice(req, res);
});

module.exports = router;
