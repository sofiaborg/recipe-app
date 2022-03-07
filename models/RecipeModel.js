const { Schema, model } = require("mongoose");

const RecipeSchema = new Schema({
  recipeTitle: { type: String, required: true },
  recipeTime: { type: Number, required: true },
  recipeDescription: { type: String, required: true },
  createdByUser: { type: Schema.Types.ObjectId, ref: "users", required: true },
  reviewed: [{ type: Schema.Types.ObjectId, ref: "reviews", required: true }],
});

const RecipeModel = model("recipes", RecipeSchema);

module.exports = RecipeModel;
