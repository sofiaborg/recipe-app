require("dotenv").config();
require("../mongoose.js");

const express = require("express");
const exphbs = require("express-handlebars");

const router = express.Router();

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const utils = require("../utils");
const UserModel = require("../models/UserModel");

//////LOG IN FUNCTIONS//////
router.get("/", (req, res) => {
  res.render("login-page");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username }, (err, user) => {
    if (user && utils.comparePassword(password, user.hashedPassword)) {
      // Logged in
      const userData = { userId: user._id, username };
      const accessToken = jwt.sign(userData, process.env.JWTSECRET);

      res.cookie("token", accessToken);
      res.redirect("/");
    } else {
      // Login incorrect
      res.send("login failed");
    }
  });
});

//gör delen med secret!!

module.exports = router;
