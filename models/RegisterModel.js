const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  registerFirstname: { type: String, required: true },
  registerLastname: { type: String, required: true },
  registerEmail: { type: String, required: true },
  registerUsername: { type: String, required: true },
  registerPassword: { type: Number, required: true },
  registerConfirm: { type: String, required: true },
});

const registerModel = mongoose.model("Register", registerSchema);

module.exports = registerModel;
