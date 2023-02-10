const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const logSchema = new Schema({
  user_id: ObjectId,
  username: String,
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: {
        type: Date,
        default: new Date(Date.now()),
      },
    },
  ],
});

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
