const express = require("express");
const mongoose = require("mongoose");
const RecipeModel = require("../models/RecipeModel.js");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("recipes/recipes-list");
});

//GET - create recipes
router.get("/create", (req, res) => {
  res.render("recipes/recipes-create");
});

router.post("/create", async (req, res) => {
  const newRecipe = new RecipeModel(req.body);
  await newRecipe.save();

  res.redirect("recipes/my-recipes");
});

//GET - my recipes
router.get("/my-recipes", async (req, res) => {
  const myRecipes = await RecipeModel.find().lean();

  res.render("recipes/my-recipes-list", { myRecipes });
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

module.exports = router;
