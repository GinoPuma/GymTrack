const User = require("../models/User");

const getMyClients = async (req, res) => {
  try {
    const clients = await User.find({
      trainerId: req.user._id,
      role: "client",
    }).select("-password");
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

const getClientDetails = async (req, res) => {
  try {
    const client = await User.findOne({
      _id: req.params.id,
      trainerId: req.user._id,
      role: "client",
    }).select("-password");
    if (!client) {
      return res.status(404).json({
        message: "Cliente no encontrado o no pertenece a este entrenador",
      });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener detalles del cliente" });
  }
};

const getMyTrainer = async (req, res) => {
  try {
    if (req.user.role !== "client" || !req.user.trainerId) {
      return res.status(400).json({
        message:
          "Solo los clientes con un entrenador asignado pueden ver esta información.",
      });
    }
    const trainer = await User.findById(req.user.trainerId).select("-password"); 
    if (!trainer) {
      return res.status(404).json({ message: "Entrenador no encontrado" });
    }
    res.json(trainer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener información del entrenador" });
  }
};

const getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" }).select(
      "-password -email -createdAt -updatedAt -__v" 
    );
    res.status(200).json(trainers);
  } catch (error) {
    console.error("Error al obtener la lista de entrenadores:", error);
    res
      .status(500)
      .json({ message: "Error al obtener la lista de entrenadores." });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -__v"); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    res.status(500).json({ message: "Error al obtener todos los usuarios." });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario por ID (Admin):", error);
    res.status(500).json({ message: "Error del servidor al obtener usuario." });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const { role } = req.body;
    if (!role || !["client", "trainer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rol inválido." });
    }

    user.role = role;
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      trainerId: updatedUser.trainerId,
    });
  } catch (error) {
    console.error("Error al actualizar rol de usuario:", error);
    res.status(500).json({ message: "Error del servidor al actualizar rol." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    await user.deleteOne();
    res.status(200).json({ message: "Usuario eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res
      .status(500)
      .json({ message: "Error del servidor al eliminar usuario." });
  }
};

module.exports = {
  getMyClients,
  getClientDetails,
  getMyTrainer,
  getAllTrainers,
  getAllTrainers, 
  getAllUsers,   
  getUserById,    
  updateUserRole, 
  deleteUser,
};
