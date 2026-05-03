const express = require("express");
const router = express.Router();

const createHouse = require("../abl/house/create.abl");
const loadHouse = require("../abl/house/load.abl");
const listHouse = require("../abl/house/list.abl");
const addMember = require("../abl/house/addMember.abl");
const removeMember = require("../abl/house/removeMember.abl");

router.post("/create", async (req, res) => {
  await createHouse(req, res);
});

router.get("/load", async (req, res) => {
  await loadHouse(req, res);
});

router.get("/list", async (req, res) => {
  await listHouse(req, res);
});

router.post("/addMember", async (req, res) => {
  await addMember(req, res);
});

router.post("/removeMember", async (req, res) => {
  await removeMember(req, res);
});

module.exports = router;
