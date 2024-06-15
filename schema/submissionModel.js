const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PredictionQuestion",
    required: true,
  },
  selected_option: { type: String, required: true },
  is_correct: { type: Boolean, required: true },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
