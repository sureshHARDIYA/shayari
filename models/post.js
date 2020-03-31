const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    body: {
      type: String,
      required: true
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag"
      }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
