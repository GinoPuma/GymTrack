const express = require("express");
const { getConversationHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:otherUserId", protect, getConversationHistory);

module.exports = router;
