const express = require("express");
const router = express.Router();

const register = require("../abl/user/register.abl");
const login = require("../abl/user/login.abl");
const findUser = require("../abl/user/find.abl");
const auth = require("../middleware/auth.middleware");

router.post("/register", async (req, res) => {
  await register(req, res);
});

router.post("/login", async (req, res) => {
  await login(req, res);
});

router.get("/find", auth, async (req, res) => {
  await findUser(req, res);
});

module.exports = router;
