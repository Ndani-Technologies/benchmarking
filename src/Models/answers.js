const mongoose = require("mongoose");

const { Schema } = mongoose;

const answerSchema = new Schema({
  language: {
    type: String,
    enum: ["English", "French", "Spanish", "Arabic"],
    default: "English",
  },
  answerOption: {
    type: String,
    required: true,
  },
  includeExplanation: {
    type: Boolean,
    required: true,
    default: false,
  },
  answerAttempt: {
    type: Number,
  },
});

const answer = mongoose.model("answers", answerSchema);

module.exports = answer;
