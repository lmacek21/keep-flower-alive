const express = require("express");
const router = express.Router();

const createHouse = require("../abl/house/create.abl");
const loadHouse = require("../abl/house/load.abl");
const listHouse = require("../abl/house/list.abl");
const deleteHouse = require("../abl/house/delete.abl");
const addMember = require("../abl/house/addMember.abl");
const removeMember = require("../abl/house/removeMember.abl");

router.post("/create", async (req, res) => {
  await createHouse(req, res);
});

// Frontend calls POST /home/load with JSON body: { id: houseId }
router.post("/load", async (req, res) => {
  await loadHouse(req, res);
});

// Keep GET for existing tools/tests (if any) but allow id from query (?id=...)
router.get("/load", async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    req.body = { id: req.query?.id };
  }
  await loadHouse(req, res);
});

router.get("/list", async (req, res) => {
  await listHouse(req, res);
});

router.delete("/delete", async (req, res) => {
  await deleteHouse(req, res);
});

// Back-compat fallback for clients/environments that cannot send DELETE with body.
router.post("/delete", async (req, res) => {
  await deleteHouse(req, res);
});

router.post("/addMember", async (req, res) => {
  await addMember(req, res);
});

router.post("/removeMember", async (req, res) => {
  await removeMember(req, res);
});

module.exports = router;
