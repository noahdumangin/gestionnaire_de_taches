const express = require("express");
const Task = require("../models/task");

const router = express.Router();

// GET /tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({})
      .sort({ createdAt: -1 }) // tri décroissant (les plus récentes d'abord)
      .limit(20);              // max 20 tâches
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});


router.post("/simulate", async (req, res) => {
  res.json({ message: "Simulation lancée (10 tâches)" });
  for (let i = 1; i <= 10; i++) {
    setTimeout(async () => {
      try {
        await Task.create({
          title: "Tâche simulée " + i,
          status: ["todo", "in_progress", "done"][Math.floor(Math.random() * 3)],
          createdAt: new Date()
        });
        console.log("Tâche simulée " + i + " créée");
      } 
      catch (err) {
        console.error("Erreur création tâche simulée :", err);
      }
    }, i * 5000);
  }
});

router.post("/", async (req, res) => {
  try {
    const newTask = await Task.create({
      title: req.body.title,
      status: req.body.status,
      createdAt: new Date()
    });
    console.log("Tâche créée :");
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
