const bcrypt = require("bcrypt");

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

  valid = valid && recipe.recipeTitle;
  valid = valid && recipe.recipeTime > 0;
  valid = valid && recipe.recipeDescription;

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
};
