const mongoose = require("mongoose");

const { Schema } = mongoose;

const questionnaireSchema = new Schema({
  languageSelector: {
    type: String,
    enum: ["English", "French", "Spanish", "Arabic"],
    default: "English",
  },
  status: {
    type: Boolean,
    default: false,
  },
  visibility: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  answerOptions: [
    {
      type: Schema.Types.ObjectId,
      ref: "answers",
    },
  ],

  // answerOptions: [
  //   {
  //     _id: {
  //       type: Schema.Types.ObjectId,
  //       ref: "answers",
  //     },
  //     includeExplanation: {
  //       type: Boolean,
  //       default: false,
  //     },
  //   },
  // ],
  whoHasAnswer: {
    userId: [
      {
        type: Object,
      },
    ],
    totalUsers: {
      type: Number,
      default: 0,
    },
  },

  response: {
    type: Number,
  },
});

const questionnaire = mongoose.model("questionnaire", questionnaireSchema);

module.exports = questionnaire;
