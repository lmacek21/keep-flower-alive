const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const loadHouse = require("../abl/house/load.abl");
const listHouse = require("../abl/house/list.abl");
const addMember = require("../abl/house/addMember.abl");
const removeMember = require("../abl/house/removeMember.abl");
const gatewayLogin = require("../abl/house/gatewayLogin.abl");

router.get("/load", auth, async (req, res) => {
  await loadHouse(req, res);
});

router.get("/list", auth, async (req, res) => {
  await listHouse(req, res);
});

router.post("/addMember", auth, async (req, res) => {
  await addMember(req, res);
});

router.post("/removeMember", auth, async (req, res) => {
  await removeMember(req, res);
});

router.post("/gatewayLogin", async (req, res) => {
  await gatewayLogin(req, res);
});

module.exports = router;
