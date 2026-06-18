const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const gatewayAuth = require("../middleware/gatewayAuth.middleware");

const createDevice = require("../abl/device/create.abl");
const listDevices = require("../abl/device/list.abl");
const deleteDevice = require("../abl/device/delete.abl");
const getDeviceBySensorId = require("../abl/device/getBySensorId.abl");
const assignRoom = require("../abl/device/assignRoom.abl");
const unassignRoom = require("../abl/device/unassignRoom.abl");

router.post("/create", gatewayAuth, async (req, res) => {
  await createDevice(req, res);
});

router.get("/list", auth, async (req, res) => {
  await listDevices(req, res);
});

router.delete("/delete", auth, async (req, res) => {
  await deleteDevice(req, res);
});

router.get("/getBySensorId", async (req, res) => {
  await getDeviceBySensorId(req, res);
});

router.post("/assignRoom", auth, async (req, res) => {
  await assignRoom(req, res);
});

router.post("/unassignRoom", auth, async (req, res) => {
  await unassignRoom(req, res);
});

module.exports = router;
