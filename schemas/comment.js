const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Post",
  },
  user: {
    type: String,
  },
  password: {
    type: String,
  },
  content: {
    type: String,
  },
});
commentSchema.set("timestamps", { createdAt: true, updatedAt: false });

module.exports = mongoose.model("Comment", commentSchema);
