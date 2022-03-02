/////////require//////////
require("dotenv").config();
require("./mongoose");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const path = require("path");
const bodyParser = require("body-parser");

const startRouter = require("./routes/start-route");
const registerRouter = require("./routes/register-route");
const recipesRouter = require("./routes/recipes-routes.js");
const reviewsRouter = require("./routes/reviews-routes.js");

const app = express();

/////////engine//////////
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const { token } = req.cookies;

  //login cookies OM INLOGGAD
  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    const tokenData = jwt.decode(token, process.env.JWTSECRET);
    res.locals.loggedIn = true;
    res.locals.username = tokenData.username;
    res.locals.userId = tokenData.userId;
    // else
  } else {
    res.locals.loggedIn = false;
  }
  next();
});

/// ROUTES
app.use("/recipes", recipesRouter);
app.use("/reviews", reviewsRouter);
app.use("/register", registerRouter);
app.use("/", startRouter);

/////port///////
app.listen(8000, () => {
  console.log("listening now at http://localhost:8000");
});
