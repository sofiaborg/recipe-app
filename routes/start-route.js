const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const utils = require("../utils");

router.get("/", (req, res) => {
  res.render("login-page");
});

module.exports = router;
