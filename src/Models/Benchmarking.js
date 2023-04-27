const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const benchmarkingSchema = new Schema({
  languageSelector: {
    type: String,
    enum: ['English', 'French', 'Spanish', 'Arabic'],
    default: 'English'
  },
  status: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  answerOptions: [{
    answer: String,
    includeExplanation: Boolean
  }]
});

const Benchmarking = mongoose.model('Benchmarking', benchmarkingSchema);

module.exports = Benchmarking;
