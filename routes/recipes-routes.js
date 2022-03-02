const express = require('express');
const utils = require('../utils.js');
const mongoose = require('mongoose');
const { Router } = require('express');
const RecipeModel = require('../models/RecipeModel.js');

// const RecipeModel = require('./models/RecipeModel.js');

const router = express.Router();

router.get('/', (req,res) => {
    res.render('home')
});

//GET - create recipes
router.get('/create', (req, res) => {
    res.render('recipes/recipes-create');
})

router.post('/create', async(req,res) => {
    const newRecipe =  new RecipeModel(req.body);
    await newRecipe.save();

    res.render('recipes/my-recipes-list')
})

//GET - my recipes
router.get('/my-recipes', async(req,res) => {
    const myRecipes = await RecipeModel.find().lean();

    res.render('recipes/my-recipes-list', {myRecipes});
});

router.all('/:id/edit', async(req,res) => {
    const recipe = await RecipeModel.findById(req.params.id).lean();

    res.render('recipes/recipes-edit', recipe)
})

//LOG OUT
router.post('/log-out', (req,res) => {
    // sätt token(cookie) till en tom sträng och ta bort den direkt
    // res.cookie("token", "", {maxAge:0})
    console.log('working');
    res.redirect('/')
})

module.exports = router;