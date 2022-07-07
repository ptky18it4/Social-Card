const router = require("express").Router();
const State = require("../models/State");

// Get
router.get("/", async (req, res, next) => {
  try {
    const state = await State.find({}, "status");
    res.status(200).json(state);
  } catch (err) {
    res.status(500).json(err);
  }
});

//create a state
router.post("/", async (req, res, next) => {
  const newState = new State({
    status: req.body.status,
  });
  try {
    const savedState = await newState.save();
    res.status(200).json(savedState);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/", async (req, res) => {
  const fixedId = "62c545e67b5b23617c77f364";
  try {
    const state = await State.findById(fixedId);
    await state.updateOne({
      $push: {
        status: req.body.status,
      },
    });
    const states = await State.find({}, "status");
    res.status(200).json(states);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a state
router.delete("/", async (req, res) => {
  const fixedId = "62c545e67b5b23617c77f364";
  try {
    await State.findOneAndUpdate(
      { _id: fixedId },
      {
        $pop: { status: 1 },
      }
    );
    const states = await State.find({});
    res.status(200).json(states);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
