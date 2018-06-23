const passport = require("passport");
const Recipe = require("../models/recipe");
const Comment = require("../models/comment");
const User = require("../models/user");

var middlewareObj = {};

//Check if currently logged in user posted the recipe
middlewareObj.checkRecipeOwnership = (req, res, next) => {
  Recipe.findOne({ recipeId: req.params["id"] }).exec((err, foundRecipe) => {
    if (err) {
      console.log(err);
    } else {
      if (foundRecipe.author.username == req.user.username || req.user.role == 'admin') {
        next();
      } else {
        res.json("You do not have permission to modify this recipe.");
      }
    }
  });
};

//Check if currently logged in user posted the comment
middlewareObj.checkCommentOwnership = (req, res, next) => {
  Comment.findById(req.params.commentId, (err, foundComment) => {
    if (err) {
      console.log(err);
    } else {
      if (foundComment.author.username == req.user.username || req.user.role == 'admin') {
        next();
      } else {
        res.json("You do not have permission to modify this comment.");
      }
    }
  });
};

//Check if currently logged in user owns the account
middlewareObj.checkAccountOwnership = (req, res, next) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser.username == req.user.username || req.user.role == 'admin') {
        next();
      } else {
        res.json("You do not have permission to modify this account.");
      }
    }
  });
};

module.exports = middlewareObj;
