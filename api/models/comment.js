const mongoose = require("mongoose");

var commentSchema = mongoose.Schema(
  {
    text: String,
    imageUrl: String,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    }
  },
  { usePushEach: true }
);

module.exports = mongoose.model("Comment", commentSchema);
