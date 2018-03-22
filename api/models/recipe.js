const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

var recipeSchema = mongoose.Schema({
    name: String,
    imageUrl: String,
    instructions: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    ratedBy: [
        {
            username: String,
            rating: Number
        }
    ],
    tags: [
        {
            type: String
        }
    ]

}, {usePushEach: true});

recipeSchema.plugin(AutoIncrement, {inc_field: 'recipeId'});

module.exports = mongoose.model("Recipe", recipeSchema);
