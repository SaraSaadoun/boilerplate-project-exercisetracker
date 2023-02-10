const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Exercise = require("./models/exercise-model");
const Log = require("./models/log-model");
const User = require("./models/User-model");
const mongoose = require("mongoose");
const {
  findAllUsers,
  findUser,
  findUserById,
  saveUser,
  saveExercise,
  findAllLogs,
  userWithAllLogs,
} = require("./functions");

app.use(cors());
app.use(express.static("public"));

//database
const dbURI =
  "mongodb+srv://test-user:test1234@cluster0.gr6xp1u.mongodb.net/exercise-tracker?retryWrites=true&w=majority";
mongoose.set("strictQuery", true); //to supress the warning appeared

mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("connected to db");
    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });
  })
  .catch((err) => console.log(err));

//parsing data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routers
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//create a new user
app.post("/api/users", async (req, res) => {
  const userName = req.body.username;
  const user = await saveUser(userName);
  console.log("from index", user);
  res.json(user);
});

//find all users
app.get("/api/users", async (req, res) => {
  const users = await findAllUsers();
  res.json(users);
});
//create an exercise for a user
app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.params._id;
  const description = req.body.description;
  const duration = +req.body.duration;
  const date = req.body.date;

  const userWithExercise = await saveExercise(id, description, duration, date);
  res.json(userWithExercise);
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const from = req.query.from;
  const to = req.query.to;
  const limit = req.query.limit; //logs no

  const id = req.params._id;

  res.json(await userWithAllLogs(id, from, to, limit));
});
