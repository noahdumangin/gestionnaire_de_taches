const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/gestionnaire_de_taches", {
})
.then(() => console.log("MongoDB connecté"))
.catch(err => console.log("Erreur MongoDB :", err));