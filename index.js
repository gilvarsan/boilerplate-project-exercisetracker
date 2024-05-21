const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { generateObjectId, findUser } = require("./funciones.js");

app.use(cors());
app.use(express.static("public"));

// Configuración del middleware
app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

const listUsers = [];
let listExercises = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", (req, res) => {
  res.json(listUsers);
});

app.post("/api/users", (req, res) => {
  const newUser = {
    username: req.body.username,
    _id: generateObjectId(),
  };

  listUsers.push(newUser);
  res.json(newUser);
});

app.post("/api/users/:_id?/exercises", (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body;

  const userFound = findUser(listUsers, userId);

  if (userFound === undefined) {
    return res.status(404).json({ error: "User not found" });
  }

  const newExercise = {
    _id: userFound._id,
    username: userFound.username,
    date: (date ? new Date(date) : new Date()).toDateString(),
    duration: Number(duration),
    description,
  };

  listExercises.push(newExercise);
  res.json(newExercise);
});

app.get("/api/users/:_id?/logs", (req, res) => {
  const userId = req.params._id;
  const userFound = findUser(listUsers, userId);

  if (userFound === undefined)
    return res.status(404).json({ error: "User not found" });

  let exercises = listExercises
    .filter((exercise) => exercise._id === userId)
    .map((exercise) => {
      return {
        description: exercise.description,
        duration: Number(exercise.duration),
        date: exercise.date,
      };
    });

  // Filtrar por fechas si se proporcionan
  let { from, to, limit } = req.query;
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

  const userLogs = {
    username: userFound.username,
    count: exercises.length,
    _id: userFound._id,
    log: exercises,
  };
  res.json(userLogs);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
