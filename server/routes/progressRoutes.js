const express = require("express");

const {
  createProgress,
  getClientProgress,
  updateProgress,
  deleteProgress,
} = require("../controllers/progressController");
const { protect, client } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, client, createProgress); 
router.get("/:clientId", protect, getClientProgress); 
router.put("/:id", protect, client, updateProgress); 
router.delete("/:id", protect, client, deleteProgress); 

module.exports = router;
