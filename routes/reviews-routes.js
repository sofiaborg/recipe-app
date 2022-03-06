const express = require("express");
const mongoose = require("mongoose");
const { Router } = require("express");
const ReviewModel = require("../models/ReviewModel.js");

const router = express.Router();

//GET - my reviews
router.get("/my-reviews", async (req, res) => {
  const myReviews = await ReviewModel.find().lean();
  res.render("reviews/my-reviews-list", { myReviews });
});

//GET - create reviews
router.get("/:id/edit", async (req, res) => {
  const review = await ReviewModel.findById(req.params.id).lean();

  res.render("reviews/reviews-edit", review);
});

router.post("/:id/edit", async (req, res) => {
  // const updatedReview =  ReviewModel{
  //   reviewDescription: req.body.reviewDescription,
  //   reviewStars: parseInt(req.body.reviewStars),
  // };

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
