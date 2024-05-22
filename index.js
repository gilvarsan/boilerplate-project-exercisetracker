const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const {
  createUser,
  createExercise,
  getUsers,
  getLogs,
} = require("./src/utils/functions.js");

app.use(cors());
app.use(express.static("public"));

// Configuración del middleware
app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", (req, res) => {
  res.json(getUsers());
});

app.post("/api/users", (req, res) => {
  const user = createUser(req.body.username);
  res.json(user);
});

app.post("/api/users/:_id?/exercises", (req, res) => {
  const exercise = createExercise(req.params._id, req.body);
  res.json(exercise);
});

app.get("/api/users/:_id?/logs", (req, res) => {
  const userLogs = getLogs(req.params._id, req.query);
  res.json(userLogs);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
