const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const gatewayAuth = require("../middleware/gatewayAuth.middleware");

const getLatestMeasurement = require("../abl/measurement/getLatest.abl");
const listMeasurements = require("../abl/measurement/list.abl");
const createMeasurement = require("../abl/measurement/create.abl");

router.get("/getLatest", auth, async (req, res) => {
  await getLatestMeasurement(req, res);
});

router.get("/list", auth, async (req, res) => {
  await listMeasurements(req, res);
});

router.post("/create", gatewayAuth, async (req, res) => {
  await createMeasurement(req, res);
});

module.exports = router;
