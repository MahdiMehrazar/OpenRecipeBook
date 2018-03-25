const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const middleware = require("../middleware");

const Recipe = require("../models/recipe");
const User = require("../models/user");
const Comment = require("../models/comment");

//CREATE new recipe
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    // Get data from form
    var name = req.body.name;
    var imageUrl = req.body.imageUrl;
    var instructions = req.body.instructions;
    var description = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var tags = [];

    for (var key in req.body.tags) {
      tags.push(req.body.tags[key]);
    }

    tags = tags.map(string => string.trim());

    var newRecipe = {
      name: name,
      imageUrl: imageUrl,
      instructions: instructions,
      description: description,
      author: author,
      tags: tags
    };

    Recipe.create(newRecipe, (err, newlyCreated) => {
      if (err) {
        console.log(err);
        res.json({ success: false, msg: "Failed to add recipe" });
      } else {
        res.json({ success: true, msg: "Recipe added successfully" });
        // Add recipe to user profile
        User.findById(req.user._id, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            user.recipes.push(newlyCreated);
            user.save();
          }
        });
      }
    });
  }
);

//READ recipes
router.get("/", (req, res) => {
  Recipe.find({})
    .limit(10)
    .skip(10 * req.query.currentPage - 10)
    .exec((err, allRecipes) => {
      if (err) {
        console.log(err);
      } else {
        Recipe.count((err, total) => {
          res.json({ recipes: allRecipes, total });
        });
      }
    });
});

//SHOW details of one recipe
router.get("/:id", (req, res) => {
  Recipe.findOne({ recipeId: req.params["id"] })
    .populate("comments")
    .exec((err, foundRecipe) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ recipe: foundRecipe });
      }
    });
});

//SHOW average rating of one recipe
router.get("/:id/rating", (req, res) => {
  Recipe.findOne({ recipeId: req.params["id"] }).exec((err, foundRecipe) => {
    if (err) {
      console.log(err);
    } else {
      Recipe.aggregate(
        [
          { $unwind: "$ratedBy" },
          { $match: { recipeId: +req.params["id"] } },
          {
            $group: {
              _id: req.params["id"],
              avgRating: { $avg: "$ratedBy.rating" }
            }
          }
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ avgRating: result });
          }
        }
      );
    }
  });
});

// UPDATE (edit) recipe
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    id = req.user._id;
    username = req.user.username;
    next();
  },
  middleware.checkRecipeOwnership,
  (req, res) => {
    var tags = [];

    for (var key in req.body.tags) {
      tags.push(req.body.tags[key]);
    }

    tags = tags.map(string => string.trim());

    Recipe.findOneAndUpdate(
      { recipeId: req.params["id"] },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          instructions: req.body.instructions,
          imageUrl: req.body.imageUrl,
          tags: tags
        }
      },
      (err, updatedRecipe) => {
        if (err) {
          res.json(err);
        } else {
          res.json({ success: true, msg: "Recipe updated successfully" });
        }
      }
    );
  }
);

// DELETE recipe
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    id = req.user._id;
    username = req.user.username;
    next();
  },
  middleware.checkRecipeOwnership,
  (req, res) => {
    //  Delete the recipe reference from user
    Recipe.find({ recipeId: req.params["id"] }, (err, foundRecipe) => {
      if (err) {
        console.log(err);
      } else {
        recipeId = foundRecipe;
        User.update(
          {},
          { $pull: { recipes: { $in: recipeId } } },
          { multi: true },
          err => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    });

    // Finally delete recipe itself
    Recipe.findOneAndRemove({ recipeId: req.params["id"] }, err => {
      if (err) {
        res.json(err);
      } else {
        res.json({ success: true, msg: "Recipe deleted successfully" });
      }
    });
  }
);

// UPDATE recipe with rating
router.put(
  "/:id/rating",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    id = req.user._id;
    username = req.user.username;
    next();
  },
  (req, res) => {
    var newRating = {
      username: req.user.username,
      rating: req.body.rating
    };

    //pull any old rating by same user
    Recipe.findOneAndUpdate(
      { recipeId: req.params["id"] },
      {
        $pull: {
          ratedBy: { username: req.user.username }
        }
      },
      { multi: true },
      (err, updatedRecipe) => {
        if (err) {
          console.log(err);
        } else {
          //push new rating
          Recipe.findOneAndUpdate(
            { recipeId: req.params["id"] },
            {
              $push: {
                ratedBy: newRating
              }
            },
            (err, updatedRecipe) => {
              if (err) {
                res.json(err);
              } else {
                res.json({
                  success: true,
                  msg: "Recipe updated successfully with new rating"
                });
              }
            }
          );
        }
      }
    );
  }
);

// Add recipe to user favourites list
router.put(
  "/:id/favourite",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    Recipe.findOne({ recipeId: req.params["id"] }).exec((err, foundRecipe) => {
      if (err) {
        console.log(err);
      } else {
        // Add recipe to user profile favourites
        User.findById(req.user._id, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            var isInArray = user.favouriteRecipes.some(recipe => {
              return recipe.equals(foundRecipe._id);
            });
            if (!isInArray) {
              user.favouriteRecipes.push(foundRecipe);
              user.save();
              res.json({ success: true, msg: "Favourited recipe" });
            } else {
              res.json({ success: false, msg: "Recipe already favourited" });
            }
          }
        });
      }
    });
  }
);

// Remove recipe from user favourites list
router.put(
  "/:id/unfavourite",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    Recipe.findOne({ recipeId: req.params["id"] }).exec((err, foundRecipe) => {
      if (err) {
        console.log(err);
      } else {
        // Remove recipe from user profile favourites
        User.findById(req.user._id, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            user.favouriteRecipes.pull(foundRecipe);
            user.save();
            res.json({ success: true, msg: "Unfavourited recipe" });
          }
        });
      }
    });
  }
);

module.exports = router;
