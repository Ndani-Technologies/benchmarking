const mongoose = require("mongoose");

const benchmarkingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  status: {
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
});
const Benchmarking = mongoose.model("Benchmarking", benchmarkingSchema);

module.exports = Benchmarking;
