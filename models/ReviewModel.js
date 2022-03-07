const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  reviewDescription: { type: String, required: true },
  reviewStars: { type: Number, required: true },
  reviewDate: { type: Number, default: Date.now },
  // postBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Recipe",
  //   required: true,
  // },
});

const ReviewModel = model("Review", reviewSchema);

module.exports = ReviewModel;
