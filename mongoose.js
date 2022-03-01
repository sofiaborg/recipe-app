const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_CONNECTION_STRING); //MOGNODB_CONNECTION_STRING är en variabel som kommer från .env-filen
