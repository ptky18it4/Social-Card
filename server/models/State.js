const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema(
  {
    status: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("State", StateSchema);
