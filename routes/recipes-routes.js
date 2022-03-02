const express = require('express');
const utils = require('../utils.js');
const mongoose = require('mongoose');
const { Router } = require('express');

// const RecipeModel = require('./models/RecipeModel.js');

const router = express.Router();

router.get('/', (req,res) => {
    res.render('home')
});

//GET - create recipes
router.get('/create', (req, res) => {
    res.render('recipes/recipes-create');
})

//GET - my recipes
router.get('/my-recipes', (req,res) => {
    res.render('recipes/my-recipes-list');
});



//LOG OUT
router.post('/log-out', (req,res) => {
    // sätt token(cookie) till en tom sträng och ta bort den direkt
    // res.cookie("token", "", {maxAge:0})
    console.log('working');
    res.redirect('/')
})

module.exports = router;