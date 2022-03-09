const bcrypt = require("bcrypt");
const { ObjectId } = require("bson");

//skapa en variabel som krypterar lösenordet
const hashPassword = (password) => {
  const hashValue = bcrypt.hashSync(password, 8); //siffran = rundor som hashen kör
  return hashValue;
};

//hämta användare från db och kolla om det inskrivna lösenordet matchar. Om match = logga in.
const comparePassword = (password, hash) => {
  const correct = bcrypt.compareSync(password, hash);
  return correct;
};

function validateRecipe(recipe) {
  let valid = true;
  valid = valid && recipe.recipeTitle.length > 0;
  valid = valid && !isNaN(recipe.recipeTime);
  valid = valid && recipe.recipeDescription.length > 0;
  valid = valid && recipe.imageUrl;
  console.log({ valid }, "slutresultatet");

  return valid;
}

function validateReview(review) {
  let valid = true;

  try {
    ObjectId(review.recipeId);
  } catch {
    valid = false;
  }
  valid = valid && review.reviewDescription.length > 0;
  valid = valid && !isNaN(review.reviewStars);

  return valid;
}

//skapa ett unikt filnamn till uppladdade bilder
const getUniqueFilename = (filename) => {
  const timestamp = Date.now();

  const extension = filename.split(".").pop();

  return `${timestamp}.${extension}`;
};

module.exports = {
  hashPassword,
  comparePassword,
  getUniqueFilename,
  validateRecipe,
  validateReview,
};
