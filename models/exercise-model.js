const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;
const exerciseSchema = new Schema({
  user_id: ObjectId,
  username: String,
  description: String,
  duration: Number,
  date: {
    type: Date,
    default: new Date(Date.now()),
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;
