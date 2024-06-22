const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // question_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "PredictionQuestion",
    //   required: true,
    // },
    question_id: { type: String, required: true },
    selected_option: { type: String, required: true },
    points_awarded: { type: Number,default:0 },
    points_calculated: { type: Boolean, default: false },
    // is_correct: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
