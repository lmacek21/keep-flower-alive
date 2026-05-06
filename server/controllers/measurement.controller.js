const express = require("express");
const router = express.Router();

const getLatestMeasurement = require("../abl/measurement/getLatest.abl");
const listMeasurements = require("../abl/measurement/list.abl");
const createMeasurement = require("../abl/measurement/create.abl");

router.get("/getLatest", async (req, res) => {
  await getLatestMeasurement(req, res);
});

router.get("/list", async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    req.body = {
      roomId: req.query?.roomId,
      startDate: req.query?.startDate,
      endDate: req.query?.endDate,
    };
  }
  await listMeasurements(req, res);
});

router.post("/create", async (req, res) => {
  await createMeasurement(req, res);
});

module.exports = router;
