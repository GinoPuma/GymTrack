// server/models/Routine.js
const mongoose = require("mongoose");

const routineSchema = new mongoose.Schema(
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
    exercises: [
      {
        exerciseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Exercise", 
          required: true,
        },
        sets: {
          type: Number,
          required: true,
          min: 1,
        },
        reps: {
          type: String, 
          required: true,
        },
        weight: {
          type: String, 
          default: "",
        },
        notes: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

const Routine = mongoose.model("Routine", routineSchema);
module.exports = Routine;
