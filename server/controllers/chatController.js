const Message = require("../models/Message");
const User = require("../models/User");

const getConversationHistory = async (req, res) => {
  try {
    const { otherUserId } = req.params; 
    const currentUserId = req.user._id;

    let conversationId;
    const user1 = currentUserId.toString();
    const user2 = otherUserId;

    if (user1 < user2) {
      conversationId = `${user1}_${user2}`;
    } else {
      conversationId = `${user2}_${user1}`;
    }

    const messages = await Message.find({ conversationId })
      .sort({ timestamps: 1 })
      .populate("senderId", "username") 
      .populate("receiverId", "username"); 
    res.json(messages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener historial de mensajes." });
  }
};

module.exports = { getConversationHistory };
