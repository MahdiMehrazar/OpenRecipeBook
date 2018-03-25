const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uniqueValidator = require("mongoose-unique-validator");

const config = require("../config/database");
const Recipe = require("../models/recipe");

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// User Schema
const UserSchema = mongoose.Schema({
  role: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "Please fill a valid email address"]
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 64
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 64
  },
  date: { type: Date, default: Date },
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe"
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  favouriteRecipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe"
    }
  ]
});

UserSchema.plugin(uniqueValidator);

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback) {
  const query = { username: username };
  User.findOne(query, callback);
};

module.exports.addUser = (newUser, callback) => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(newUser.password, salt))
    .then(hash => {
      newUser.password = hash;
      newUser.save(callback);
    })
    .catch(err => console.log("There was an error adding a user."));
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt
    .compare(candidatePassword, hash)
    .then(isMatch => {
      callback(null, isMatch);
    })
    .catch(err => {
      console.log("Authentication error" + err);
    });
};
