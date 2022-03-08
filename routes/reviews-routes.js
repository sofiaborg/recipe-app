const express = require("express");
const mongoose = require("mongoose");
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const ReviewModel = require("../models/ReviewModel.js");

const router = express.Router();

//////visa MINA reviews//////
router.get("/my-reviews", async (req, res, next) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  user = tokenData.userId;

  if (user) {
    const myReviews = await ReviewModel.find({ reviewedByUser: user }).lean();

    res.render("reviews/my-reviews-list", { myReviews });
  } else {
    next();
  }
});

//////uppdatera/radera MINA reviews//////
router.get("/:id/edit", async (req, res) => {
  const review = await ReviewModel.findById(req.params.id).lean();

  res.render("reviews/reviews-edit", review);
});

router.post("/:id/edit", async (req, res) => {
  const review = await ReviewModel.findById(req.params.id);

  review.reviewDescription = req.body.reviewDescription;
  review.reviewStars = parseInt(req.body.reviewStars);

  await review.save();

  res.redirect("/reviews/my-reviews");
});

router.get("/:id/delete", async (req, res) => {
  const review = await ReviewModel.findById(req.params.id).lean();

  res.render("reviews/reviews-delete", review);
});

router.post("/:id/delete", async (req, res) => {
  await ReviewModel.findByIdAndDelete(req.params.id);

  res.redirect("/reviews/my-reviews");
});

module.exports = router;
