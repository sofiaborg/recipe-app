const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  reviewDescription: { type: String, required: true },
  reviewStars: { type: Number, required: true },
  reviewDate: { type: Number, default: Date.now },
  reviewedRecipe: { type: String, ref: "recipes", required: true },
});

const ReviewModel = model("reviews", reviewSchema);

module.exports = ReviewModel;
