const express = require("express");
const {
  createDietPlan,
  getClientDietPlans,
  updateDietPlan,
  deleteDietPlan,
  createMeal,
  getMeals,
  getDietPlanById,
} = require("../controllers/dietController");
const { protect, trainer, client } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:clientId", protect, trainer, createDietPlan);

router.get("/:id", protect, getDietPlanById);

router.get("/client/:clientId", protect, getClientDietPlans); 

router.put("/:id", protect, trainer, updateDietPlan);
router.delete("/:id", protect, trainer, deleteDietPlan);

module.exports = router;
