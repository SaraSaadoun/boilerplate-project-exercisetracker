const Exercise = require("./models/exercise-model");
const Log = require("./models/log-model");
const User = require("./models/user-model");
const mongoose = require("mongoose");

const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return { _id: id, username: user.username };
  } catch (err) {
    throw err;
  }
};
const doesUserExist = async (username) => {
  const isFound = await User.count({ username: username });
  return isFound;
};
const findUser = async (username) => {
  try {
    const isFound = await doesUserExist(username);
    console.log(isFound);
    switch (isFound) {
      case 0:
        return { count: 0 };
      case 1:
        const user = await User.findOne({ username: username });
        return { count: 1, _id: user._id, username };
    }
  } catch (err) {
    throw err;
  }
};

const findAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    throw err;
  }
};

const saveUser = async (username) => {
  try {
    const foundUser = await findUser(username);
    console.log(foundUser.count, foundUser._id, username);
    if (foundUser.count) {
      return { _id: foundUser._id, username: foundUser.username };
    }
    user = new User({
      username,
    });
    user = await user.save();
    return user;
  } catch (err) {
    throw err;
  }
};

const saveExercise = async (user_id, description, duration, date) => {
  try {
    let dateObj = new Date(date);

    if (dateObj.toDateString() === "Invalid Date") {
      dateObj = new Date();
    }

    const user = await findUserById(user_id);
    const exercise = new Exercise({
      user_id,
      username: user.username,
      description,
      duration,
      date: dateObj,
    });

    await exercise.save();
    const userWithExercises = {
      username: user.username,
      description,
      duration,
      date: dateObj.toDateString(),
      _id: user_id,
    };
    const isFound = await Log.count({ user_id: user_id });
    if (isFound) {
      //update
      delete exercise.user_id;
      await Log.findOneAndUpdate(
        { user_id: user_id },
        { $addToSet: { log: exercise }, $inc: { count: 1 } }
      );
    } else {
      //create
      const log = new Log({
        user_id: user_id,
        count: 1,
        log: [
          {
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date,
          },
        ],
      });
      await log.save();
    }
    return userWithExercises;
  } catch (err) {
    throw err;
  }
};
const countExercises = async (user_id) => {
  try {
    const cnt = Exercise.count({ user_id: user_id });
    return cnt;
  } catch (err) {
    throw err;
  }
};

const findAllLogs = async (user_id, from, to, limit) => {
  try {
    let logs = await Log.find({ user_id: user_id });
    let allLogs = logs[0]["log"];
    // console.log(logs);

    console.log(allLogs);
    if (from) {
      const fromObj = new Date(from);
      allLogs = allLogs.filter((val) => {
        console.log(val.date, fromObj);
        return val.date >= fromObj;
      });
    }
    // console.log(allLogs);
    if (to) {
      const toObj = new Date(to);
      allLogs = allLogs.filter((val) => val.date <= toObj);
    }
    if (limit != null && allLogs.length > limit) {
      allLogs.length = limit;
    }
    let newLogs = [];
    for (let i = 0; i < allLogs.length; i++) {
      newLogs.push({
        description: allLogs[i].description,
        duration: allLogs[i].duration,
        date: allLogs[i].date.toDateString(),
      });
    }
    // console.log("all", allLogs);
    return newLogs;
  } catch (err) {
    throw err;
  }
};
// return user obj + count of exercises + log arr(desc(string), dur(number), date(string)),
const userWithAllLogs = async (user_id, from, to, limit) => {
  //   return {
  //     id,
  //     username,
  //     from,
  //     to,
  //     limit,
  //   };
  const user = await findUserById(user_id);
  const exercisesNo = await countExercises(user_id);
  const allLogs = await findAllLogs(user_id, from, to, limit);

  const result = {
    _id: user_id,
    username: user.username,
    count: allLogs.length,
    log: allLogs,
  };
  return result;
};
module.exports = {
  findAllUsers,
  findUser,
  findUserById,
  saveUser,
  saveExercise,
  findAllLogs,
  userWithAllLogs,
};

// findAllLogs("saraHamza", "2020", "2024", 1);
