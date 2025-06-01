const express = require("express");
const { getChatbotResponse } = require("../controllers/chatbotController");
const { protect } = require("../middleware/authMiddleware"); 
const router = express.Router();

router.post("/", protect, getChatbotResponse); 
module.exports = router;
