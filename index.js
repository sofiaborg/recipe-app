/////////require////////// :)
require("dotenv").config(); //läser av .env-filen och använder variabeln som host (ist. för länken som bör vara hidden)
require("./mongoose");
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const utils = require("./utils");
const registerRouter = require("./routes/register-route");
const recipesRouter = require("./routes/recipes-routes.js");
const reviewsRouter = require("./routes/reviews-routes.js");
const startRouter = require("./routes/start-route");

/////////set and use//////////
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
// To support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// To parse cookies from the HTTP Request
app.use(cookieParser());

/////////engine//////////
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

//login settings
app.use((req, res, next) => {
  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    const tokenData = jwt.decode(token, process.env.JWTSECRET);
    res.locals.loggedIn = true;
    res.locals.userId = tokenData.userId;
    res.locals.username = tokenData.username;
  } else {
    res.locals.loggedIn = false;
  }
  next();
});

const forceAuthorize = (req, res, next) => {
  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    next();
  } else {
    res.sendStatus(401);
  }
};

////////////////////////

/// LÄGGER TILL ROUTES
app.use("/recipes", recipesRouter);
app.use("/reviews", reviewsRouter);
app.use("/register", registerRouter);
app.use("/", startRouter);

/////port///////
app.listen(8000, () => {
  console.log("listening now at http://localhost:8000");
});
