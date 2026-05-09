const express = require("express");
const router = express.Router();

const superUser = require("../middleware/superUser.middleware");
const uploadImage = require("../middleware/uploadImage.middleware");
const createFlower = require("../abl/flower/create.abl");
const deleteFlower = require("../abl/flower/delete.abl");
const listFlower = require("../abl/flower/list.abl");
const updateFlower = require("../abl/flower/update.abl");

router.post("/create", superUser, uploadImage, async (req, res) => {
  await createFlower(req, res);
});

router.delete("/delete", superUser, async (req, res) => {
  await deleteFlower(req, res);
});

router.get("/list", superUser, async (req, res) => {
  await listFlower(req, res);
});

router.post("/update", superUser, async (req, res) => {
  await updateFlower(req, res);
});

module.exports = router;
