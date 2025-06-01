const User = require("../models/User");
const generateToken = require("../utils/jwt");

const registerUser = async (req, res) => {
  const { username, email, password, role, trainerId, adminAccessKey } =
    req.body; 

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  if (role === "trainer") {
    if (!adminAccessKey || adminAccessKey !== process.env.ADMIN_TRAINER_KEY) {
      return res
        .status(403)
        .json({
          message:
            "Clave de acceso de administrador inválida para registrar un entrenador.",
        });
    }
  }

  if (role === "client" && !trainerId) {
    return res
      .status(400)
      .json({ message: "Un cliente debe tener un ID de entrenador asignado" });
  }
  if (role === "trainer" && trainerId) {
    return res.status(400).json({
      message: "Un entrenador no puede tener un ID de entrenador asignado",
    });
  }

  const user = await User.create({
    username,
    email,
    password,
    role,
    trainerId: role === "client" ? trainerId : null,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      trainerId: user.trainerId,
      token: generateToken(user._id, user.role, user.trainerId),
    });
  } else {
    res.status(400).json({ message: "Datos de usuario inválidos" });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      trainerId: user.trainerId,
      token: generateToken(user._id, user.role, user.trainerId),
    });
  } else {
    res.status(401).json({ message: "Email o contraseña inválidos" });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
};

module.exports = { registerUser, authUser, getUserProfile };
