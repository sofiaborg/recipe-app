const express = require("express");
const mongoose = require("mongoose");
const RecipeModel = require("../models/RecipeModel.js");
const ReviewModel = require("../models/ReviewModel.js");
const router = express.Router();

router.get("/", async (req, res) => {
  const allRecipes = await RecipeModel.find().lean();

  res.render("recipes/recipes-list", { allRecipes });
});

//GET - create recipes
router.get("/create", (req, res) => {
  res.render("recipes/recipes-create");
});

router.post("/create", async (req, res) => {
  const newRecipe = new RecipeModel(req.body);
  await newRecipe.save();

  res.redirect("/recipes/my-recipes");
});

//GET - my recipes
router.get("/my-recipes", async (req, res) => {
  const myRecipes = await RecipeModel.find().lean();

  res.render("recipes/my-recipes-list", { myRecipes });
});

router.get("/:id", async (req, res) => {
  const recipe = await RecipeModel.findById(req.params.id).lean();
  const review = await ReviewModel.findById(req.params.id).lean();

  res.render("recipes/recipes-single", { recipe, review });
});

router.get("/:id/edit", async (req, res) => {
  const recipe = await RecipeModel.findById(req.params.id).lean();

  res.render("recipes/recipes-edit", recipe);
});

router.post("/:id/edit", async (req, res) => {
  const updatedRecipe = {
    recipeTitle: req.body.recipeTitle,
    recipeTime: parseInt(req.body.recipeTime),
    recipeDescription: req.body.recipeDescription,
  };

  await RecipeModel.updateOne({ _id: req.params.id }, { $set: updatedRecipe });
  res.redirect("recipes/my-recipes");
});

router.get("/:id/delete", async (req, res) => {
  const recipe = await RecipeModel.findById(req.params.id).lean();
  res.render("recipes/recipes-delete", recipe);
});

router.post("/:id/delete", async (req, res) => {
  await RecipeModel.findById(req.params.id).deleteOne();

  res.redirect("recipes/my-recipes");
});

router.post("/:id/reviews", async (req, res) => {
  const recipeId = req.params.id;
  const newReview = new ReviewModel({
    reviewDescription: req.body.reviewDescription,
    reviewStars: parseInt(req.body.reviewStars),
    postBy: recipeId,
  });
  await newReview.save();

  res.redirect("/recipes/" + recipeId);
});

//LOG OUT
router.post("/log-out", (req, res) => {
  // sätt token(cookie) till en tom sträng och ta bort den direkt
  // res.cookie("token", "", {maxAge:0})
  console.log("working");
  res.redirect("/");
});

module.exports = router;
