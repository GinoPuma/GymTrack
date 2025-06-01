const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    weight: {
      type: Number, 
      required: true,
    },
    measurements: {
      // en cm
      chest: { type: Number },
      waist: { type: Number },
      hips: { type: Number },
      arms: { type: Number },
      legs: { type: Number }, 
    },
    photos: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
      default: "",
    },
    performanceMetrics: {
      benchPress1RM: { type: Number },
      squat1RM: { type: Number },
      deadlift1RM: { type: Number },
      run5kTime: { type: String }, 
    },
  },
  { timestamps: true }
);

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
