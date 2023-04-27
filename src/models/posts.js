const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    unlike: {
      type: Array,
      default: [],
    },
    comment:{
      type: Array,
      default: [],
    },
    title:{
        type:String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);