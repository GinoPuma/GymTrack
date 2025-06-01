const DietPlan = require("../models/DietPlan");
const Meal = require("../models/Meal"); // Si usas un catálogo global
const User = require("../models/User"); // Asegúrate de que User esté importado

// Trainer: Crear un plan de dieta para un cliente
const createDietPlan = async (req, res) => {
  // El clientId viene de req.params.clientId en la ruta POST /dietplans/:clientId
  // trainerId viene de req.user._id
  const { name, description, startDate, endDate, meals } = req.body;
  const clientId = req.params.clientId; // Este clientId NO viene en el body, sino en los parámetros de la URL

  if (req.user.role === "trainer") {
    const client = await User.findOne({
      _id: clientId, // Usamos el clientId de los parámetros
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
      .json({ message: "Solo los entrenadores pueden crear planes de dieta." });
  }

  try {
    const dietPlan = await DietPlan.create({
      name,
      description,
      clientId, // Usamos el clientId de los parámetros
      trainerId: req.user._id,
      startDate,
      endDate,
      meals,
    });
    res.status(201).json(dietPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Trainer y Cliente: Obtener planes de dieta de un cliente
const getClientDietPlans = async (req, res) => {
  try {
    const { clientId } = req.params;
    let dietPlans;

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
      dietPlans = await DietPlan.find({ clientId }).populate(
        "meals.mealId",
        "name description calories protein carbs fats"
      ); // Populate detallado
    } else if (
      req.user.role === "client" &&
      String(req.user._id) === clientId
    ) {
      dietPlans = await DietPlan.find({ clientId }).populate(
        "meals.mealId",
        "name description calories protein carbs fats"
      ); // Populate detallado
    } else {
      return res
        .status(403)
        .json({ message: "No tienes permiso para ver estos planes de dieta." });
    }

    res.json(dietPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Trainer: Actualizar un plan de dieta
const updateDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, meals } = req.body;

    const dietPlan = await DietPlan.findById(id);
    if (!dietPlan) {
      return res.status(404).json({ message: "Plan de dieta no encontrado." });
    }

    if (String(dietPlan.trainerId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para actualizar este plan." });
    }

    dietPlan.name = name || dietPlan.name;
    dietPlan.description = description || dietPlan.description;
    dietPlan.startDate = startDate || dietPlan.startDate;
    dietPlan.endDate = endDate || dietPlan.endDate;
    dietPlan.meals = meals || dietPlan.meals;

    const updatedDietPlan = await dietPlan.save();
    res.json(updatedDietPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Trainer: Eliminar un plan de dieta
const deleteDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const dietPlan = await DietPlan.findById(id);

    if (!dietPlan) {
      return res.status(404).json({ message: "Plan de dieta no encontrado." });
    }

    if (String(dietPlan.trainerId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para borrar este plan." });
    }

    await DietPlan.deleteOne({ _id: id });
    res.json({ message: "Plan de dieta eliminado exitosamente." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDietPlanById = async (req, res) => {
  try {
    const { id } = req.params; 
    const dietPlan = await DietPlan.findById(id).populate(
      "meals.mealId",
      "name description calories protein carbs fats"
    ); 

    if (!dietPlan) {
      return res.status(404).json({ message: "Plan de dieta no encontrado." });
    }

    if (
      req.user.role === "trainer" &&
      String(dietPlan.trainerId) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "No autorizado para ver este plan de dieta." });
    }
    if (
      req.user.role === "client" &&
      String(dietPlan.clientId) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "No autorizado para ver este plan de dieta." });
    }

    res.json(dietPlan);
  } catch (error) {
    console.error("Error al obtener plan de dieta por ID:", error);
    res
      .status(500)
      .json({ message: "Error del servidor al obtener plan de dieta." });
  }
};

const createMeal = async (req, res) => {
  try {
    const meal = await Meal.create(req.body);
    res.status(201).json(meal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({});
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, calories, protein, carbs, fats } = req.body;

    const meal = await Meal.findById(id);
    if (!meal) {
      return res.status(404).json({ message: "Comida no encontrada." });
    }

    meal.name = name || meal.name;
    meal.description = description || meal.description;
    meal.calories = calories !== undefined ? calories : meal.calories; 
    meal.protein = protein !== undefined ? protein : meal.protein;
    meal.carbs = carbs !== undefined ? carbs : meal.carbs;
    meal.fats = fats !== undefined ? fats : meal.fats;

    const updatedMeal = await meal.save();
    res.json(updatedMeal);
  } catch (error) {
    console.error("Error al actualizar comida:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await Meal.findById(id);

    if (!meal) {
      return res.status(404).json({ message: "Comida no encontrada." });
    }

    await Meal.deleteOne({ _id: id });
    res.json({ message: "Comida eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar comida:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDietPlan,
  getClientDietPlans,
  updateDietPlan,
  deleteDietPlan,
  createMeal,
  getMeals,
  getDietPlanById,
  updateMeal, 
  deleteMeal, 
};
