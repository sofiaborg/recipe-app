const express = require("express");
const mongoose = require("mongoose");
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const ReviewModel = require("../models/ReviewModel.js");

const router = express.Router();

//////visa MINA reviews//////
router.get("/my-reviews", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  user = tokenData.userId;

  const myReviews = await ReviewModel.find({ reviewedByUser: user })
    .populate("reviewedRecipe")
    .lean();

  res.render("reviews/my-reviews-list", { myReviews });
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

  if (review.reviewDescription.length > 0 && review.reviewStars > 0) {
    await review.save();

    res.redirect("/reviews/my-reviews");
  } else {
    res.render("reviews/reviews-edit", {
      error: "Please fill in all fields",
    });
  }
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
