const Progress = require("../models/Progress");
const User = require("../models/User");

const createProgress = async (req, res) => {
  if (req.user.role !== "client") {
    return res
      .status(403)
      .json({ message: "Solo los clientes pueden registrar el progreso." });
  }

  const { weight, measurements, photos, notes, performanceMetrics } = req.body;

  try {
    const progress = await Progress.create({
      clientId: req.user._id,
      weight,
      measurements,
      photos,
      notes,
      performanceMetrics,
    });
    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getClientProgress = async (req, res) => {
  try {
    const { clientId } = req.params;
    let progressRecords;

    if (req.user.role === "trainer") {
      const client = await User.findOne({
        _id: clientId,
        trainerId: req.user._id,
      });
      if (!client) {
        return res
          .status(404)
          .json({
            message: "Cliente no encontrado o no pertenece a este entrenador.",
          });
      }
      progressRecords = await Progress.find({ clientId }).sort({ date: -1 });
    } else if (
      req.user.role === "client" &&
      String(req.user._id) === clientId
    ) {
      progressRecords = await Progress.find({ clientId: req.user._id }).sort({
        date: -1,
      });
    } else {
      return res
        .status(403)
        .json({ message: "No tienes permiso para ver este progreso." });
    }

    res.json(progressRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProgress = async (req, res) => {
  if (req.user.role !== "client") {
    return res
      .status(403)
      .json({ message: "Solo los clientes pueden actualizar su progreso." });
  }

  try {
    const { id } = req.params;
    const progress = await Progress.findById(id);

    if (!progress) {
      return res
        .status(404)
        .json({ message: "Registro de progreso no encontrado." });
    }

    if (String(progress.clientId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para actualizar este registro." });
    }

    const updatedProgress = await Progress.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProgress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProgress = async (req, res) => {
  if (req.user.role !== "client") {
    return res
      .status(403)
      .json({ message: "Solo los clientes pueden eliminar su progreso." });
  }

  try {
    const { id } = req.params;
    const progress = await Progress.findById(id);

    if (!progress) {
      return res
        .status(404)
        .json({ message: "Registro de progreso no encontrado." });
    }

    if (String(progress.clientId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este registro." });
    }

    await Progress.deleteOne({ _id: id });
    res.json({ message: "Registro de progreso eliminado exitosamente." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProgress,
  getClientProgress,
  updateProgress,
  deleteProgress,
};
