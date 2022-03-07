const express = require("express");
const jwt = require("jsonwebtoken");
const ReviewModel = require("../models/ReviewModel.js");
const RecipeModel = require("../models/RecipeModel");
const UserModel = require("../models/UserModel");

const router = express.Router();

//////hämta start-sidan och rendera alla recept + dess skapare//////
router.get("/", async (req, res) => {
  const allRecipes = await RecipeModel.find().populate("createdByUser").lean();
  const users = await UserModel.find().lean();

  res.render("home", { allRecipes, users });
});

//////skapa nytt recept//////
router.get("/create", (req, res) => {
  res.render("recipes/recipes-create");
});

router.post("/create", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  const newRecipe = new RecipeModel({
    recipeTitle: req.body.recipeTitle,
    recipeTime: parseInt(req.body.recipeTime),
    recipeDescription: req.body.recipeDescription,
    createdByUser: tokenData.userId, //hämtar userId från cookies!!
  });

  await newRecipe.save();

  res.redirect("/recipes/my-recipes");
});

//////hämta ett single recipe och posta en review på receptet//////
router.get("/:id", async (req, res) => {
  res.render("recipes/recipes-single");
});

router.post("/:id/reviews", async (req, res) => {
  const recipeId = req.params.id;
  const newReview = new ReviewModel({
    reviewDescription: req.body.reviewDescription,
    reviewStars: parseInt(req.body.reviewStars),
  });
  await newReview.save();

  res.redirect("/recipes/" + recipeId);
});

/////////////////////////

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

//GET - my recipes
router.get("/my-recipes", async (req, res) => {
  const myRecipes = await RecipeModel.find().lean();

  res.render("recipes/my-recipes-list", { myRecipes });
});

//LOG OUT
router.post("/log-out", (req, res) => {
  // sätt token(cookie) till en tom sträng och ta bort den direkt
  // res.cookie("token", "", {maxAge:0})
  console.log("working");
  res.redirect("/");
});

module.exports = router;
