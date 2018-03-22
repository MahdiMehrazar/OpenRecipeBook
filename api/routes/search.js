const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const middleware = require("../middleware");

const Recipe = require("../models/recipe");
const User = require("../models/user");
const Comment = require("../models/comment");

//READ recipes by searching name
router.get("/recipes/name/:name", (req, res) => {
  Recipe.find({ name: { $regex: req.params.name, $options: "i" } }).exec(
    (err, allRecipes) => {
      if (err) {
        console.log(err);
      } else {
        Recipe.count(
          { name: { $regex: req.params.name, $options: "i" } },
          (err, total) => {
            res.json({ recipes: allRecipes, total });
          }
        );
      }
    }
  );
});

//READ recipes by searching tags
router.get("/recipes/tags/:tags", (req, res) => {
  //split tags into array
  var searchArray = req.params.tags.split(",").map(string => string.trim());

  console.log(searchArray);

  Recipe.find({ tags: { $in: searchArray } }).exec(
    (err, allRecipes) => {
      if (err) {
        console.log(err);
      } else {
        Recipe.count(
          { tags: { $in: searchArray } },
          (err, total) => {
            res.json({ recipes: allRecipes, total });
          }
        );
      }
    }
  );
});

module.exports = router;
