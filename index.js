/////////require//////////
require("dotenv").config();
require("./mongoose");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const path = require("path");
const bodyParser = require("body-parser");

const forceAuthorize = require("./middlewares");

const userRouter = require("./routes/user-route");
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

  //login cookies OM INLOGGAD. Denna kod körs varje gång en req skickas. Om användare är logged in sätts variabeln {{loggedIn}} till true. Om ej inloggad sätts den till false.
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
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/user", userRouter);
app.use("/recipes", forceAuthorize, recipesRouter);
app.use("/reviews", forceAuthorize, reviewsRouter);

/////port///////
app.listen(8000, () => {
  console.log("listening now at http://localhost:8000");
});
