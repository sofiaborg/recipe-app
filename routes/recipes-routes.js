const express = require('express');
const utils = require('../utils.js');
const mongoose = require('mongoose');
const { Router } = require('express');

// const RecipeModel = require('./models/RecipeModel.js');

const router = express.Router();

router.get('/', (req,res) => {
    
    res.render('home')
})

module.exports = router;