const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const utils = require("../utils");

//get
router.get("/", (req, res) => {
  console.log("123");
  res.render("register-page");
});

//post
router.post("/", async (req, res) => {
  const { firstname, lastname, email, username, password, confirmPassword } =
    req.body;

  UserModel.findOne({ username }, async (err, user) => {
    if (user) {
      res.send("Username already exist");
    } else if (password !== confirmPassword) {
      res.send("Password don't match");
    } else {
      const newUser = new UserModel({
        firstname,
        lastname,
        email,
        username,
        password: utils.hashedPassword(password),
      });

      await newUser.save();

      res.redirect("/");
    }
  });
});

module.exports = router;
