const mongoose = require("mongoose");

const benchmarkingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Inprogress"],
      default: "Inactive",
      required: true,
    },
    questionnaire: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questionnaire",
      },
    ],
    completionLevel: {
      type: Number,
      min: 0,
      max: 1,
      get(value) {
        return `${(value * 100).toFixed(2)}%`;
      },
      set(value) {
        return parseFloat(value) / 100;
      },
      default: 0,
    },
    startdate: {
      type: Date,
      default: Date.now,
    },
    enddate: {
      type: Date,
    },
  },
  {
    timestamp: true,
  }
);
const Benchmarking = mongoose.model("Benchmarking", benchmarkingSchema);

module.exports = Benchmarking;
