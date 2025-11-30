const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

//connexion à MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/gestionnaire_de_taches")
  .then(() => console.log("connecté à la bdd"))
  .catch(err => console.error(err));

// Charger les routes
const taskRoutes = require("../routes/task_route");
app.use("/task", taskRoutes);

module.exports = app;
