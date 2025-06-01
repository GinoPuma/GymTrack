require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const { initSocket } = require("./config/socket"); 

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const routineRoutes = require("./routes/routineRoutes");
const dietRoutes = require("./routes/dietRoutes");
const progressRoutes = require("./routes/progressRoutes");
const chatRoutes = require("./routes/chatRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const exerciseCatalogRoutes = require("./routes/exerciseCatalogRoutes");
const mealCatalogRoutes = require("./routes/mealCatalogRoutes");

connectDB();

const app = express();
const server = http.createServer(app); 

initSocket(server);

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
  })
);
app.use(express.json()); 

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/dietplans", dietRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/exercise-catalog", exerciseCatalogRoutes); 
app.use("/api/meal-catalog", mealCatalogRoutes);

app.get("/", (req, res) => {
  res.send("API de entrenador personal está funcionando...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal!");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
