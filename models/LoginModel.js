const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userUsername: { type: String, required=true },
    userPassword: { type: Number, required=true },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;