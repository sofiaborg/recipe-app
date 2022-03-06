require("dotenv").config();
require("../mongoose.js");
const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const router = express.Router();
const UserModel = require("../models/UserModel");
const { hashPassword, comparePassword } = require("../utils");

//////REGISTER//////
router.get("/register", (req, res) => {
  res.render("register-page");
});

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, username, password, confirmPassword } =
    req.body;

  UserModel.findOne({ username }, async (err, user) => {
    if (user) {
      res.render("register-page", {
        error: "Username already exist",
      });
    } else if (password !== confirmPassword) {
      res.render("register-page", {
        error: "Password not matching",
      });
    } else {
      const newUser = new UserModel({
        firstname,
        lastname,
        email,
        username,
        password: hashPassword(password),
      });

      await newUser.save();

      res.redirect("/");
    }
  });
});

//////LOG IN//////
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username }, (err, user) => {
    if (user && comparePassword(password, user.password)) {
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

//////LOG OUT//////

router.post("/log-out", (req, res) => {
  res.cookie("token", " ", { maxAge: 0 });
  res.redirect("/");
});

module.exports = router;
