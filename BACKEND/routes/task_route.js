const express = require("express");
const Task = require("../models/task");

const router = express.Router();

//GET /tasks?after=<date>
router.get("/", async (req, res) => {
  try {
    const after = req.query.after;
    let filter = {};
    if (after) {
      filter.createdAt = { $gt: new Date(after) };
    }
    const tasks = await Task.find(filter)
      .sort({ createdAt: 1 })
      .limit(20);
    res.json(tasks);
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

//POST /simulate
router.post("/simulate", async (req, res) => {
  res.json({ message: "Simulation lancée (10 tâches)" });
  for (let i = 1; i <= 10; i++) {
    setTimeout(async () => {
      try {
        await Task.create({
          title: "Tâche simulée " + i,
          status: ["todo", "in_progress", "done"][Math.floor(Math.random() * 3)],
        });
        console.log("Tâche simulée "+i+ " créée");
      } 
      catch (err) {
        console.error("Erreur création tâche simulée :", err);
      }
    }, i * 5000); // 5 secondes entre chaque tâche
  }
});

module.exports = router;
