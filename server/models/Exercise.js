const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, 
    },
    description: {
      type: String,
      default: "",
    },
    muscleGroup: {
      type: String,
      enum: [
        "Chest",
        "Back",
        "Shoulders",
        "Biceps",
        "Triceps",
        "Legs",
        "Abs",
        "Cardio",
        "Full Body",
      ],
      required: true,
    },
    equipment: {
      type: String,
      default: "None",
    },
    videoUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
