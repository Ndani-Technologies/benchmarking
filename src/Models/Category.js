const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ["English", "French", "Spanish", "Arabic"],
    default: "English",
  },
  titleEng: {
    type: String,
    required: true,
    unique: true,
  },
  titleAr: {
    type: String,
    unique: true,
  },
  titleSp: {
    type: String,
    unique: true,
  },
  titleFr: {
    type: String,
    unique: true,
  },
});

categorySchema.index({ titleEng: 1 }, { unique: true });
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
