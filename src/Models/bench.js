const mongoose = require("mongoose");

const benchmarkingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    country: {
      type: String,
      required: true,
    },

    user: {
      type: Object,
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
      max: 100,
      get(value) {
        return `${(value * 100).toFixed(2)}%`;
      },
      set(value) {
        return parseFloat(value) / 100;
      },
      default: 0,
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    end_date: {
      type: Date,
    },
    user_resp: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "questionnaire",
        },
        selectedOption: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "answers",
        },
        comment: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamp: true,
  }
);

benchmarkingSchema.index({ title: 1 }, { unique: true });

const Benchmarking = mongoose.model("Benchmarking", benchmarkingSchema);

module.exports = Benchmarking;
