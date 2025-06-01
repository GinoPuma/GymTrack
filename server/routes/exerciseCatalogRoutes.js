const express = require("express");
const {
  createExercise,
  getExercises,
  updateExercise,
  deleteExercise,
} = require("../controllers/routineController");
const { protect, trainer } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, trainer, createExercise);
router.get("/", protect, getExercises);

router.put("/:id", protect, trainer, updateExercise);
router.delete("/:id", protect, trainer, deleteExercise);

module.exports = router;
