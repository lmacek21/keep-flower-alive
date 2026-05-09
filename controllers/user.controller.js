const express = require("express");
const router = express.Router();

const register = require("../abl/user/register.abl");
const login = require("../abl/user/login.abl");

router.post("/register", async (req, res) => {
  await register(req, res);
});

router.post("/login", async (req, res) => {
  await login(req, res);
});

module.exports = router;
