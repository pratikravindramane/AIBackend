const PredictionQuestion = require("../schema/questionModel");
const Submission = require("../schema/submissionModel");
const User = require("../schema/userModel");

const submitPrediction = async (req, res) => {
  try {
    const { user_id, question_id, selected_option } = req.body;

    // const question = await PredictionQuestion.findById(question_id);
    // if (!question)
    //   return res.status(404).json({ message: "Question not found" });

    // const isCorrect = question.answers.find(
    //   (answer) => answer.answer_text === selected_option
    // ).is_correct;

    const submission = new Submission({
      user_id,
      question_id,
      selected_option,
      // isCorrect,
    });
    await submission.save();

    // const user = await User.findById(user_id);
    // if (user) {
    //   user.total_questions_answered += 1;
    //   if (isCorrect) {
    //     user.points += 1;
    //     user.correct_answers += 1;
    //   }
    //   await user.save();
    // }

    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserPredictionSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user_id: req.params.user_id,
    }).populate("question_id");
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOpenPredictionQuestions = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const submittedQuestionIds = await Submission.find({ user_id }).distinct(
      "question_id"
    );
    const openQuestions = await PredictionQuestion.find({
      _id: { $nin: submittedQuestionIds },
      question_closed: false,
    });

    res.status(200).json(openQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitPrediction,
  getUserPredictionSubmissions,
  getOpenPredictionQuestions,
};
