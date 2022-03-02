const express = require("express");
const utils = require("../utils.js");
const mongoose = require("mongoose");

// const ReviewModel = require('./models/RewievModel.js');

const router = express.Router();

//GET - my reviews
router.get("/my-reviews", (req, res) => {
  res.render("reviews/my-reviews-list");
});

module.exports = router;
