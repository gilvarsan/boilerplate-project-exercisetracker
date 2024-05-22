const User = require("../classes/user.js");
const Exercise = require("../classes/exercise.js");

const arrayUsers = [];
const arrayExercises = [];

const createUser = (username) => {
  const user = new User(username);
  arrayUsers.push(user);
  return user;
};

const createExercise = (userId, datosExercises) => {
  const { description, duration, date } = datosExercises;

  const userFound = findUser(getUsers(), userId);

  if (userFound === undefined) {
    return { error: "User not found" };
  }

  const exercise = new Exercise(
    userFound._id,
    userFound.username,
    date,
    duration,
    description
  );

  arrayExercises.push(exercise);
  return exercise;
};

const findUser = (arrayUsers, userId) => {
  return arrayUsers.find((user) => user._id === userId);
};

const getUsers = () => {
  return arrayUsers;
};

const getLogs = (userId, query) => {
  const userFound = findUser(getUsers(), userId);

  if (userFound === undefined) return { error: "User not found" };

  let exercises = arrayExercises
    .filter((exercise) => exercise._id === userId)
    .map((exercise) => {
      return {
        description: exercise.description,
        duration: Number(exercise.duration),
        date: exercise.date,
      };
    });

  exercises = filterDate(exercises, query);

  const userLogs = {
    username: userFound.username,
    count: exercises.length,
    _id: userFound._id,
    log: exercises,
  };

  return userLogs;
};

const filterDate = (exercises, query) => {
  // Filtrar por fechas si se proporcionan
  let { from, to, limit } = query;
  if (from)
    exercises = exercises.filter(
      (exercise) => new Date(exercise.date) >= new Date(from)
    );
  if (to)
    exercises = exercises.filter(
      (exercise) => new Date(exercise.date) <= new Date(to)
    );

  // Limitar el número de registros si se proporciona
  if (limit) exercises = exercises.slice(0, limit);

  return exercises;
};

module.exports = { createUser, createExercise, findUser, getUsers, getLogs };
