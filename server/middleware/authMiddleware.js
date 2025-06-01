const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler"); 

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Middleware Protect: Token decodificado:", decoded); 

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("No autorizado, usuario no encontrado.");
      }

      console.log("Middleware Protect: req.user adjuntado:", req.user); 
      next();
    } catch (error) {
      console.error(
        "Middleware Protect: Error de token o usuario:",
        error.message
      );
      res.status(401);
      throw new Error("No autorizado, token fallido o expirado."); 
    }
  } else {
    res.status(401);
    throw new Error("No autorizado, no hay token.");
  }
});

const trainer = (req, res, next) => {
  // console.log("Middleware Trainer: req.user en este punto:", req.user); // Log para debug

  if (req.user && req.user.role === "trainer") {
    next();
  } else {
    res.status(403);
    throw new Error("Acceso denegado, solo para entrenadores.");
  }
};

const client = (req, res, next) => {
  // console.log("Middleware Client: req.user en este punto:", req.user); // Log para debug

  if (req.user && req.user.role === "client") {
    next();
  } else {
    res.status(403);
    throw new Error("Acceso denegado, solo para clientes.");
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Acceso denegado, solo para administradores.");
  }
};

module.exports = { protect, trainer, client, admin };
