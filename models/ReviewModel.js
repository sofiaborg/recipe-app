const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  reviewDescription: { type: String, required: true },
  reviewStars: { type: Number, required: true },
  reviewDate: { type: Date, default: Date.now },
  reviewedRecipe: {
    type: Schema.Types.ObjectId,
    ref: "recipes",
    required: true,
  },
  reviewedByUser: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const ReviewModel = model("reviews", reviewSchema);

module.exports = ReviewModel;
