const express = require("express");
const router = express.Router();

const createFlower = require("../abl/flower/create.abl");
const deleteFlower = require("../abl/flower/delete.abl");
const listFlower = require("../abl/flower/list.abl");
const updateFlower = require("../abl/flower/update.abl");
const upload = require("../middleware/upload.middleware");

router.post("/create", upload.single("image"), async (req, res) => {
  await createFlower(req, res);
});

router.delete("/delete", async (req, res) => {
  await deleteFlower(req, res);
});

router.get("/list", async (req, res) => {
  await listFlower(req, res);
});

router.post("/update", upload.single("image"), async (req, res) => {
  await updateFlower(req, res);
});

module.exports = router;
