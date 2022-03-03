const express = require("express");
const utils = require("../utils.js");
const mongoose = require("mongoose");
const { Router } = require("express");
const ReviewModel = require("../models/ReviewModel.js");

const router = express.Router();

//GET - my reviews
router.get("/my-reviews", async (req, res) => {
  const myReviews = await ReviewModel.find().lean();
  console.log("hello");
  res.render("reviews/my-reviews-list", { myReviews });
});

//GET - create review
router.get("/create", (req, res) => {
  res.render("reviews/reviews-create");
});

router.post("/create", async (req, res) => {
  const newReview = new ReviewModel(req.body);
  await newReview.save();

  res.redirect("/reviews/my-reviews");
});

module.exports = router;
