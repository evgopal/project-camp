const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ExpressError = require("./utilities/expressError");

const campgrounds = require("./routes/campground");
const reviews = require("./routes/review");

mongoose
  .connect("mongodb://localhost:27017/camp", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connection Open!!!");
  })
  .catch((err) => {
    console.log("Oh No error!!");
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "secret!!!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expire: Date.now() + 1000 * 60 * 60 * 24,
    maxAge: 1000 * 60 * 60 * 24,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page is not here", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something is Wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening on port 3000!!");
});
