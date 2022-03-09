const express = require("express");
const fileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const ReviewModel = require("../models/ReviewModel.js");
const RecipeModel = require("../models/RecipeModel");
const UserModel = require("../models/UserModel");
const { Router } = require("express");
const { getUniqueFilename } = require("../utils.js");
// const path = require('path');

const router = express.Router();

//////MINA RECEPT//////

//////hämta ALLA MINA recept//////
router.get("/my-recipes", async (req, res, next) => {
  // const myRecipes = await RecipeModel.find().lean();

  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  user = tokenData.userId;
  // const recipeId = req.params.id;

  if (user) {
    const myRecipes = await RecipeModel.find({ createdByUser: user }).lean();
    res.render("recipes/my-recipes-list", { myRecipes });
  } else {
    next();
  }
});

//////uppdatera/radera MITT recept//////
router.get("/:id/edit", async (req, res) => {
  const cookieId = res.locals.userId; // ID på den som är inloggad
  const recepieId = req.params.id; // receptet ID

  let findUser = await RecipeModel.findOne({ _id: recepieId });
  console.log(findUser.createdByUser);
  const correctUser = findUser.createdByUser.toString();

  if (cookieId === correctUser) {
    const recipe = await RecipeModel.find({ createdByUser: user }).lean();
    res.render("recipes/recipes-edit", recipe);
  } else {
    res.render("not-found.hbs");
  }
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

//////skapa nytt recept//////
router.get("/create", (req, res) => {
  res.render("recipes/recipes-create");
});

router.post("/create", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);

  // håmtar fil från formuläret, filnamn och vart filen ska sparas
  const image = req.files.image; //gör en if-sats. denna ska bara köras om req.files är satt!
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

  await newRecipe.save();

  res.redirect("/");
});

//////hämta ett single recipe och posta en review på receptet//////
router.get("/:id", async (req, res) => {
  const singleRecipe = await RecipeModel.findById(req.params.id)
    .populate("reviews")
    .lean();

  res.render("recipes/recipes-single", { singleRecipe });
});

router.post("/:id/reviews/", async (req, res) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  const recipeId = req.params.id;

  const newReview = new ReviewModel({
    reviewDescription: req.body.reviewDescription,
    reviewStars: parseInt(req.body.reviewStars),
    reviewedRecipe: recipeId,
    reviewedByUser: tokenData.userId,
  });

  //hitta det recept vars ObectId matchar med id i URLen
  let recipeWithReview = await RecipeModel.findOne({ _id: recipeId });

  //gå in i reviewed-arrayn i RecipeModel och pusha in den skapade reviewns ObjectId
  recipeWithReview.reviews.push(newReview._id);
  await newReview.save();
  await recipeWithReview.save();

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
