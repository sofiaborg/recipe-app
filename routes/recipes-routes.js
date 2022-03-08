const express = require("express");
const fileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const ReviewModel = require("../models/ReviewModel.js");
const RecipeModel = require("../models/RecipeModel");
const UserModel = require("../models/UserModel");
const { getUniqueFilename, validateRecipe } = require("../utils.js");

// const path = require('path');

const router = express.Router();

router.get("/", async (req, res) => {
  const allRecipes = await RecipeModel.find().populate("createdByUser").lean();
  const users = await UserModel.find().lean();

  res.render("home", { allRecipes, users });
});

//GET - create recipes
router.get("/create", (req, res) => {
  res.render("recipes/recipes-create");
});

router.post("/create", async (req, res) => {
  //hämtar id från inloggad user för att kunna visa vem som skapat respektive recept
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  // håmtar fil från formuläret, filnamn och vart filen ska sparas
  const image = req.files.image;
  const filename = getUniqueFilename(image.name);
  const uploadPath = "./public/uploads/" + filename;

  await image.mv(uploadPath);

  const newRecipe = new RecipeModel({
    recipeTitle: req.body.recipeTitle,
    recipeTime: parseInt(req.body.recipeTime),
    recipeDescription: req.body.recipeDescription,
    imageUrl: "/uploads/" + filename,
    createdByUser: tokenData.userId, //hämtar userId från cookies!!
  });

  if (validateRecipe(newRecipe)) {
    await newRecipe.save();

    res.redirect("/recipes/my-recipes");
  } else {
    res.render("recipes/recipes-create", {
      error: "You did not enter all fields correctly",
      ...newRecipe,
    });
  }
});

//GET - my recipes
router.get("/my-recipes", async (req, res) => {
  const myRecipes = await RecipeModel.find().lean();

  res.render("recipes/my-recipes-list", { myRecipes });
});

router.get("/:id", async (req, res) => {
  const recipe = await RecipeModel.findById(req.params.id)
    .populate("createdByUser")
    .lean();
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
  res.redirect("/recipes/my-recipes");
});

router.get("/:id/delete", async (req, res) => {
  const recipe = await RecipeModel.findById(req.params.id).lean();
  res.render("recipes/recipes-delete", recipe);
});

router.post("/:id/delete", async (req, res) => {
  await RecipeModel.findById(req.params.id).deleteOne();

  res.redirect("/recipes/my-recipes");
});

router.post("/:id/reviews", async (req, res) => {
  const recipeId = req.params.id;
  const newReview = new ReviewModel({
    reviewDescription: req.body.reviewDescription,
    reviewStars: parseInt(req.body.reviewStars),

    //postBy: recipeId,
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
