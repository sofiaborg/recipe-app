const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewDescription: { type: String, required: true },
  reviewStars: { type: Number, required: true },
  reviewDate: { type: Date, default: Date.now },
});

const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
