const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  recipeTitle: { type: String, required: true },
  recipeTime: { type: Number, required: true },
  recipeDescription: { type: String, required: true },
  /* createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, */
});

const RecipeModel = mongoose.model("Recipe", recipeSchema);

module.exports = RecipeModel;
