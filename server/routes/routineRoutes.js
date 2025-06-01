const express = require("express");
const {
  createRoutine,
  getClientRoutines,
  updateRoutine,
  deleteRoutine,
  getRoutineById,
} = require("../controllers/routineController");
const { protect, trainer, client } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, trainer, createRoutine);

router.get("/:id", protect, getRoutineById);

router.get("/client/:clientId", protect, getClientRoutines); // <-- CAMBIO AQUÍ

router.put("/:id", protect, trainer, updateRoutine);
router.delete("/:id", protect, trainer, deleteRoutine);

module.exports = router;
