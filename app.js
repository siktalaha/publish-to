//jshint esversion:6
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3000;
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch(() => {
    console.log("Failed connection");
  });
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
var secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });
const User = new mongoose.model("UserEnteries", userSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/submit", (req, res) => {
  res.render("submit");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  console.log(req.body.username);
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save((err) => {
    if (!err) {
      console.log("USer added succesfully");
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});
app.post("/login", (req, res) => {
  User.findOne({ email: req.body.username }, (err, found) => {
    if (err) {
      console.log(err);
    } else {
      if (found) {
        if (found.password == req.body.password) {
          res.render("secrets");
          console.log(found.password);
        }
      } else {
        console.log("No user found");
      }
    }
  });
});
app.listen(port, () => {
  console.log("Listening to port ", port);
});
