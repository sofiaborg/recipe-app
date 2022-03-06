const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  recipeByUser: [
    { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  ],
});

const UserModel = model("Users", UserSchema);

module.exports = UserModel;
