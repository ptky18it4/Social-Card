const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/", async (req, res, next) => {
  const newPost = new Post({
    avatar: req.body.avatar,
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
  });

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // if (post.userId === req.body.userId) {
    if (req.body.content !== null && req.body.content !== undefined) {
      await post.updateOne({
        $set: req.body,
        $push: {
          comment: [{ content: req.body.content }],
        },
      });
      const posts = await Post.find({});
      res.status(200).json(posts);
      // res.status(200).json("the post has been updated");
    } else {
      await post.updateOne({
        $set: req.body,
      });
      // const posts = await Post.find({});
      // res.status(200).json(posts);
      res.status(200).json("the post has been updated");
    }

    // } else {
    // res.status(403).json("you can update only your post");
    // }
  } catch (err) {
    res.status(500).json(err);
  }
});

// revert for add
router.delete("/lasted", async (req, res) => {
  try {
    const post = await Post.findOne().sort({ createdAt: -1 }).limit(1);
    await post.deleteOne();
    res.status(200).json("The post has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//revert for delete
router.patch("/delete", async (req, res) => {
  try {
    const post = await Post.findOne().sort({ deletedAt: -1 }).limit(1);
    await post.restore();
    res.status(200).json("The post has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  if (req.params.id) {
    try {
      // const post = await Post.findById(req.params.id);
      await Post.delete({ _id: req.params.id });
      res.status(200).json("The post has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

//like / dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all post
router.get("/", async (req, res) => {
  try {
    const post = await Post.find({});
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts

router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
