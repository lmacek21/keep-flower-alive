const express = require("express");
const router = express.Router();

const createGateway = require("../abl/gateway/create.abl");
const receiveGatewayMeasurement = require("../abl/gateway/measurement.abl");

router.post("/create", async (req, res) => {
    await createGateway(req, res);
});

router.post("/measurement", async (req, res) => {
    await receiveGatewayMeasurement(req, res);
});

module.exports = router;