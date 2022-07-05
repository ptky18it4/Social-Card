const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      // required: true,
    },
    name: {
      type: String,
      max: 50,
      default: "",
    },
    description: {
      type: String,
      max: 500,
      default: "",
    },
    image: {
      type: String,
    },
    avatar: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
      required: true,
    },
    comment: [
      {
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);
PostSchema.plugin(mongooseDelete, {
  deletedAt: true,
});
module.exports = mongoose.model("Post", PostSchema);
