const Routine = require("../models/Routine");
const Exercise = require("../models/Exercise"); 
const User = require("../models/User"); 

const createRoutine = async (req, res) => {
  const { name, description, clientId, startDate, endDate, exercises } =
    req.body;

  if (req.user.role === "trainer") {
    const client = await User.findOne({
      _id: clientId,
      trainerId: req.user._id,
    });
    if (!client) {
      return res.status(404).json({
        message: "Cliente no encontrado o no pertenece a este entrenador.",
      });
    }
  } else {
    return res
      .status(403)
      .json({ message: "Solo los entrenadores pueden crear rutinas." });
  }

  try {
    const routine = await Routine.create({
      name,
      description,
      clientId,
      trainerId: req.user._id,
      startDate,
      endDate,
      exercises,
    });
    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getClientRoutines = async (req, res) => {
  try {
    const { clientId } = req.params;
    let routines;

    if (req.user.role === "trainer") {
      const client = await User.findOne({
        _id: clientId,
        trainerId: req.user._id,
      });
      if (!client) {
        return res.status(404).json({
          message: "Cliente no encontrado o no pertenece a este entrenador.",
        });
      }
      routines = await Routine.find({ clientId }).populate(
        "exercises.exerciseId",
        "name muscleGroup equipment" 
      );
    } else if (
      req.user.role === "client" &&
      String(req.user._id) === clientId
    ) {
      routines = await Routine.find({ clientId }).populate(
        "exercises.exerciseId",
        "name muscleGroup equipment" 
      );
    } else {
      return res
        .status(403)
        .json({ message: "No tienes permiso para ver estas rutinas." });
    }

    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoutine = async (req, res) => {
  try {
    const { id } = req.params; // Routine ID
    const { name, description, clientId, startDate, endDate, exercises } =
      req.body;

    const routine = await Routine.findById(id);
    if (!routine) {
      return res.status(404).json({ message: "Rutina no encontrada." });
    }

    if (String(routine.trainerId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para actualizar esta rutina." });
    }

    routine.name = name || routine.name;
    routine.description = description || routine.description;
    routine.startDate = startDate || routine.startDate;
    routine.endDate = endDate || routine.endDate;
    routine.exercises = exercises || routine.exercises;

    const updatedRoutine = await routine.save();
    res.json(updatedRoutine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params; 
    const routine = await Routine.findById(id);

    if (!routine) {
      return res.status(404).json({ message: "Rutina no encontrada." });
    }

    if (String(routine.trainerId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para borrar esta rutina." });
    }

    await Routine.deleteOne({ _id: id }); 
    res.json({ message: "Rutina eliminada exitosamente." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoutineById = async (req, res) => {
  try {
    const { id } = req.params; 
    const routine = await Routine.findById(id).populate(
      "exercises.exerciseId",
      "name muscleGroup equipment"
    ); 

    if (!routine) {
      return res.status(404).json({ message: "Rutina no encontrada." });
    }

    if (
      req.user.role === "trainer" &&
      String(routine.trainerId) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "No autorizado para ver esta rutina." });
    }
    if (
      req.user.role === "client" &&
      String(routine.clientId) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "No autorizado para ver esta rutina." });
    }

    res.json(routine);
  } catch (error) {
    console.error("Error al obtener rutina por ID:", error);
    res.status(500).json({ message: "Error del servidor al obtener rutina." });
  }
};
const createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create(req.body);
    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({});
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, muscleGroup, equipment, videoUrl } = req.body;

    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return res.status(404).json({ message: "Ejercicio no encontrado." });
    }

    exercise.name = name || exercise.name;
    exercise.description = description || exercise.description;
    exercise.muscleGroup = muscleGroup || exercise.muscleGroup;
    exercise.equipment = equipment || exercise.equipment;
    exercise.videoUrl = videoUrl || exercise.videoUrl;

    const updatedExercise = await exercise.save();
    res.json(updatedExercise);
  } catch (error) {
    console.error("Error al actualizar ejercicio:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ message: "Ejercicio no encontrado." });
    }

    await Exercise.deleteOne({ _id: id });
    res.json({ message: "Ejercicio eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar ejercicio:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRoutine,
  getClientRoutines,
  updateRoutine,
  deleteRoutine,
  createExercise,
  getExercises,
  getRoutineById,
  updateExercise, 
  deleteExercise, 
};
