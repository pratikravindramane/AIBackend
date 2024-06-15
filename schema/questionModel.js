const mongoose = require('mongoose');

const predictionAnswerSchema = new mongoose.Schema({
  answer_text: { type: String, required: true },
  is_correct: { type: Boolean, required: true }
});

const predictionQuestionSchema = new mongoose.Schema({
  question_text: { type: String, required: true },
  answers: [predictionAnswerSchema],
  question_closed: { type: Boolean }
});

const PredictionQuestion = mongoose.model('PredictionQuestion', predictionQuestionSchema);

module.exports = PredictionQuestion;
