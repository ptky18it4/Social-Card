const mongoose = require("mongoose");

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
      data: Buffer,
      contentType: String,
    },
    avatar: {
      data: Buffer,
      contentType: String,
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

module.exports = mongoose.model("Post", PostSchema);
