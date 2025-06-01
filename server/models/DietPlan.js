const mongoose = require("mongoose");

const dietPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    meals: [
      {
        mealId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Meal", 
          required: true,
        },
        timeOfDay: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          default: "",
        },
        notes: {
          type: String,
          default: "",
        },
      },
    ],
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFats: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);
module.exports = DietPlan;
