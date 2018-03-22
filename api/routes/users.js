const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const middleware = require("../middleware");

const Recipe = require("../models/recipe");
const User = require("../models/user");
const Comment = require("../models/comment");

// All Users
router.get("/", (req, res) => {
  User.find({'role': {'$ne':'admin' }}, (err, allUsers) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ users: allUsers });
    }
  });
});

//SHOW profile of one user
router.get("/profile/:username", (req, res) => {
  User.findOne({ username: req.params["username"] }).populate("favouriteRecipes").exec((err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ user: foundUser });
    }
  });
});

// Register
router.post("/register", (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, err });
    } else {
      res.json({ success: true, msg: "User registered" });
    }
  });
});

// Authenticate
router.post("/authenticate", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "User Not Found" });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({ data: user }, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: "Bearer " + token,
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      } else {
        return res.json({ success: false, msg: "Wrong Password" });
      }
    });
  });
});

// Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  }
);

// Get the recipes of the user
router.get("/recipes", (req, res) => {
  Recipe.find({ "author.username": req.query.username }, (err, recipes) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ recipes: recipes });
    }
  });
});

// DELETE user
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    id = req.user._id;
    username = req.user.username;
    next();
  },
  middleware.checkAccountOwnership,
  (req, res) => {
    // Delete all user recipes
    Recipe.remove({ "author.username": req.user.username }, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("deleted user recipes successfully");
      }
    });

    // Delete user comments references from recipes
    Comment.find(
      { "author.username": req.user.username },
      (err, foundComment) => {
        if (err) {
          console.log(err);
        } else {
          commentId = foundComment;
          console.log(commentId);
          Recipe.update(
            {},
            { $pull: { comments: { $in: commentId } } },
            { multi: true },
            err => {
              if (err) {
                console.log(err);
              } else {
                console.log(
                  "deleted user comments references from recipe successfully"
                );
                // Delete all user comments
                Comment.remove(
                  { "author.username": req.user.username },
                  err => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("deleted user comments successfully");
                    }
                  }
                );
              }
            }
          );
        }
      }
    );

    // Finally delete user
    User.findByIdAndRemove(req.params["id"], err => {
      if (err) {
        res.json(err);
      } else {
        res.json({ success: true, msg: "User deleted successfully" });
      }
    });
  }
);

module.exports = router;
