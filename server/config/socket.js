const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

let io;
const connectedUsers = new Map();

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select("-password -__v"); 
      if (!socket.user) {
        return next(new Error("Authentication error: User not found"));
      }
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `User connected: ${socket.user.username} (ID: ${socket.user._id})`
    );
    connectedUsers.set(socket.user._id.toString(), socket.id);

    socket.emit("connected", {
      message: "Successfully connected to chat server!",
    });

    socket.on("sendMessage", async ({ receiverId, content }) => {
      if (!socket.user) {
        console.log("Unauthenticated user tried to send message.");
        return;
      }

      const senderId = socket.user._id;
      const receiver = await User.findById(receiverId);

      if (!receiver) {
        console.log(`Receiver ${receiverId} not found`);
        return;
      }

      let isValidConversation = false;

      if (
        socket.user.role === "trainer" &&
        receiver.role === "client" &&
        String(receiver.trainerId) === String(senderId) 
      ) {
        isValidConversation = true;
      }
      else if (
        socket.user.role === "client" &&
        receiver.role === "trainer" &&
        String(socket.user.trainerId) === String(receiver._id) 
      ) {
        isValidConversation = true;
      }

      if (!isValidConversation) {
        console.log(
          `Invalid chat attempt between ${socket.user.username} (role: ${socket.user.role}) and ${receiver.username} (role: ${receiver.role}).`
        );
        console.log(
          `Sender TrainerId: ${socket.user.trainerId}, ReceiverId: ${receiver._id}, Receiver TrainerId: ${receiver.trainerId}`
        );
        return;
      }

      let conversationId;
      const user1 = senderId.toString();
      const user2 = receiverId.toString();
      if (user1 < user2) {
        conversationId = `${user1}_${user2}`;
      } else {
        conversationId = `${user2}_${user1}`;
      }

      const newMessage = await Message.create({
        senderId,
        receiverId,
        content,
        conversationId,
      });

      const messageToSendToFrontend = {
        ...newMessage._doc, 
        senderId: { _id: senderId, username: socket.user.username }, 
        receiverId: { _id: receiverId, username: receiver.username }, 
      };

      socket.emit("receiveMessage", messageToSendToFrontend);

      const receiverSocketId = connectedUsers.get(receiverId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", messageToSendToFrontend);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user?.username || "Unknown"}`);
      connectedUsers.delete(socket.user._id.toString());
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIo, connectedUsers };
