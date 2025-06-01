const express = require("express");
const {
  createMeal,
  getMeals,
  updateMeal,
  deleteMeal,
} = require("../controllers/dietController"); 
const { protect, trainer } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, trainer, createMeal); 
router.get("/", protect, getMeals); 

router.put("/:id", protect, trainer, updateMeal); 
router.delete("/:id", protect, trainer, deleteMeal); 

module.exports = router;
