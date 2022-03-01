const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    reviewDescription: { type: String, required=true },
    reviewStars: { type: Number, required=true },
    
});

const ReviewModel = mongoose.model("review", reviewSchema);

module.exports = ReviewModel;