const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const middleware = require("../middleware");

const Recipe = require("../models/recipe");
const User = require("../models/user");
const Comment = require("../models/comment");

//CREATE new comment
router.post(
  "/:id/comments",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    // Get data from form
    var text = req.body.text;
    var imageUrl = req.body.imageUrl;
    var author = {
      id: req.user._id,
      username: req.user.username
    };

    var newComment = {
      text: text,
      imageUrl: imageUrl,
      author: author
    };

    Comment.create(newComment, (err, newlyCreated) => {
      if (err) {
        res.json({ success: false, msg: "Failed to add comment" });
      } else {
        res.json({ success: true, msg: "Comment added successfully" });
        // Add comment to user profile
        User.findById(req.user._id, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            user.comments.push(newlyCreated);
            user.save();
          }
        });
        // Add comment to recipe
        Recipe.findOne({ recipeId: req.params["id"] }).exec((err, recipe) => {
          if (err) {
            console.log(err);
          } else {
            recipe.comments.push(newlyCreated);
            recipe.save();
          }
        });
      }
    });
  }
);

// UPDATE (edit) comment
router.put(
  "/:id/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    id = req.user._id;
    username = req.user.username;
    next();
  },
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        $set: {
          text: req.body.text,
          imageUrl: req.body.imageUrl
        }
      },
      (err, updatedComment) => {
        if (err) {
          res.json(err);
        } else {
          res.json({ success: true, msg: "Comment updated successfully" });
        }
      }
    );
  }
);

// DELETE comment
router.delete(
  "/:id/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    id = req.user._id;
    username = req.user.username;
    next();
  },
  middleware.checkCommentOwnership,
  (req, res) => {
    // Delete the comment from recipes and users
    Recipe.update(
      { },
      { $pullAll: { "comments": [req.params.commentId] } },
      { "multi": true },
      err => {
        if (err) {
          console.log(err);
        } else {
          console.log("deleted user comments from recipe successfully");
        }
      }
    );
    
    User.update(
      { },
      { $pullAll: { "comments": [req.params.commentId] } },
      { "multi": true },
      err => {
        if (err) {
          console.log(err);
        } else {
          console.log("deleted user comments from user successfully");
        }
      }
    );

    // Finally delete comment itself
    Comment.findByIdAndRemove(req.params.commentId, err => {
      if (err) {
        res.json(err);
      } else {
        res.json({ success: true, msg: "Comment deleted successfully" });
      }
    });
  }
);

module.exports = router;
