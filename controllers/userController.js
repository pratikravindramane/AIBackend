const bcrypt = require("bcrypt");
const User = require("../schema/userModel");
const { generateOTP, generateToken } = require("../helper/generateToken");
const Team = require("../schema/teamModel");
const sgMail = require("@sendgrid/mail");
const Submission = require("../schema/submissionModel");
const { default: axios } = require("axios");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//hello world
async function fetchDataFromAPI2() {
  try {
    const response = await axios.get(
      // "https://aibackend-ibgo.onrender.com/api/getallleagues"
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data from API 2:", error);
    // throw error;
  }
}
const signUp = async (req, res) => {
  const { username, email, password, socialProvider, socialId } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const otp = generateOTP();
    const otpExpiry = Date.now() + 300000;

    if (socialProvider && socialId) {
      user = new User({
        username,
        email,
        socialProvider,
        socialId,
        otp,
        otpExpiry,
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({
        username,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
      });
    }

    await user.save();

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
      html: `<strong>Your OTP code is ${otp}</strong>`,
    };

    await sgMail.send(msg);

    res.status(201).json({ message: "OTP sent to email", userId: user._id });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyOTPSignUp = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.isVerified = true;

    await user.save();

    const token = generateToken(user);

    res.status(200).json({ message: "OTP verified", token, user });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(await fetchDataFromAPI2());
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const token = generateToken(user);

    res.json({ token, user });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const otp = generateOTP();

    user.otp = otp;
    await user.save();

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Password Reset Request",
      text: `You requested a password reset. Please use the following OTP to reset your password: ${otp}`,
      html: `<p>You requested a password reset. Please use the following OTP to reset your password:</p><p><strong>${otp}</strong></p>`,
    };

    await sgMail.send(msg);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    if (error.response && error.response.body && error.response.body.errors) {
      console.error("Error in forgot password:", error.response.body.errors);
      return res.status(500).json({
        message: "Email sending failed",
        errors: error.response.body.errors,
      });
    }
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (otp !== user.otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verify OTP:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (otp !== user.otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = async (req, res) => {
  res.json({ message: "Logout successful" });
};

// const makeFavoriteTeam = async (req, res) => {
//   const { userId, teamId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     const team = await Team.findById(teamId);
//     if (!team) {
//       res.status(404).json({ message: "Team not found" });
//       return;
//     }

//     if (!user.teamId.includes(teamId)) {
//       user.teamId.push(teamId);
//       await user.save();
//     }

//     res.json({ message: "Favorite team added successfully", user });
//   } catch (error) {
//     console.error("Error in making favorite team:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const makeFavoriteTeam = async (req, res) => {
  const { userId, teamId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.teamId.includes(teamId)) {
      user.teamId.push(teamId);
      await user.save();
    }

    res.json({ message: "Favorite team added successfully", user });
  } catch (error) {
    console.error("Error in making favorite team:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const unmakeFavoriteTeam = async (req, res) => {
  const { userId, teamId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const index = user.teamId.indexOf(teamId);
    if (index === -1) {
      res
        .status(400)
        .json({ message: "Team not found in user's favorite teams" });
      return;
    }

    user.teamId.splice(index, 1);
    await user.save();

    res.json({ message: "Favorite team removed successfully", user });
  } catch (error) {
    console.error("Error in unmaking favorite team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// const getFavoriteTeams = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const user = await User.findById(userId).populate("teamId");
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     const favoriteTeams = user.teamId;
//     res.json({ favoriteTeams });
//   } catch (error) {
//     console.error("Error in getting favorite teams:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const getFavoriteTeams = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const favoriteTeams = user.teamId;
    res.json({ favoriteTeams });
  } catch (error) {
    console.error("Error in getting favorite teams:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const accuracy =
      user.total_questions_answered > 0
        ? (user.correct_answers / user.total_questions_answered) * 100
        : 0;

    res.status(200).json({
      points: user.points,
      total_questions_answered: user.total_questions_answered,
      accuracy: accuracy.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const newStats = async (req, res) => {
//   try {
//     const predictions = await Submission.find({
//       userId: req.params.userId,
//     }).populate("question_id");
//     let total, right;
//     predictions.map((p) => {
//       p.question_id.answers.filter((a) => {
//         if (a._id == p.selected_option) {
//           total += 1;
//           if (a.is_correct == true) right += 1;
//         }
//       });
//     });
//     console.log({ total, right });
//     res.send({ total, right });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const newStats = async (req, res) => {
  try {
    // Fetch predictions and populate question details
    const predictions = await Submission.find({
      userId: req.params.userId,
    }).populate("question_id");

    // Initialize counters for total questions and correct answers
    let total = 0;
    let right = 0;

    // Iterate over each prediction
    predictions.forEach((p) => {
      // Check each answer for the current question
      p.question_id.answers.forEach((a) => {
        // Check if the selected option matches the current answer
        if (a._id.equals(p.selected_option)) {
          // Increment total count
          total += 1;
          // Increment right count if the answer is correct
          if (a.is_correct) right += 1;
        }
      });
    });

    // Log the results (optional)
    console.log({ total, right });

    // Send the response with total and correct answers count
    res.send({ total, right });
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ message: error.message });
  }
};

const questions = [
  {
    _id: "question1",
    question_text: "Who will WIN?",
    answers: [
      { _id: "answer1a", answer_text: "Real Madrid", is_correct: true },
      { _id: "answer1b", answer_text: "Barcelona", is_correct: false },
    ],
    question_closed: true,
  },
  {
    _id: "question2",
    question_text: "Who will WIN?",
    answers: [
      {
        _id: "answer2a",
        answer_text: "Manchester United",
        is_correct: true,
      },
      { _id: "answer2b", answer_text: "Liverpool", is_correct: false },
    ],
    question_closed: false,
  },
  {
    _id: "question3",
    question_text: "Who will WIN?",
    answers: [
      { _id: "answer3a", answer_text: "Bayern Munich", is_correct: true },
      {
        _id: "answer3b",
        answer_text: "Borussia Dortmund",
        is_correct: false,
      },
    ],
    question_closed: true,
  },
  {
    _id: "question4",
    question_text: "Who will WIN?",
    answers: [
      { _id: "answer4a", answer_text: "Juventus", is_correct: true },
      { _id: "answer4b", answer_text: "AC Milan", is_correct: false },
    ],
    question_closed: false,
  },
  {
    _id: "question5",
    question_text: "Who will WIN?",
    answers: [
      {
        _id: "answer5a",
        answer_text: "Paris Saint-Germain",
        is_correct: true,
      },
      { _id: "answer5b", answer_text: "Chelsea", is_correct: false },
    ],
    question_closed: false,
  },
];
// put the cron job here
const giveAllUserPoints = async (req, res) => {
  try {
    const endedQuestions = questions.filter((e) => e.question_closed); // get all ended questions
    // get all non assigned submissions
    const nonEndedSubmissions = await Submission.find({
      points_calculated: false,
    });

    // get range of day, week, month and year
    const getRange = (unit) => {
      const now = new Date();
      const start = new Date(now);
      const end = new Date(now);

      if (unit === "day") {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
      } else if (unit === "week") {
        start.setDate(now.getDate() - now.getDay());
        end.setDate(start.getDate() + 6);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
      } else if (unit === "month") {
        start.setDate(1);
        end.setMonth(now.getMonth() + 1);
        end.setDate(0);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
      } else if (unit === "year") {
        start.setMonth(0, 1);
        end.setMonth(11, 31);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
      }
      return { start, end };
    };

    const ranges = {
      day: getRange("day"),
      week: getRange("week"),
      month: getRange("month"),
      year: getRange("year"),
    };

    // Fetch all users to reset their points if needed
    const users = await User.find();

    // reset all the point of user as per the date type respectivily
    for (let user of users) {
      // Check and reset daily points
      if (user.lastDailyReset < ranges.day.start) {
        user.daily = 0;
        user.lastDailyReset = new Date();
      }
      // Check and reset weekly points
      if (user.lastWeeklyReset < ranges.week.start) {
        user.weekly = 0;
        user.lastWeeklyReset = new Date();
      }
      // Check and reset monthly points
      if (user.lastMonthlyReset < ranges.month.start) {
        user.monthly = 0;
        user.lastMonthlyReset = new Date();
      }
      // Check and reset yearly points
      if (user.lastYearlyReset < ranges.year.start) {
        user.yearly = 0;
        user.lastYearlyReset = new Date();
      }
      await user.save(); // Save the user with the reset points
    }

    let testArry = [];
    // adding points to the submission and assigning that it has calculated
    for (let submission of nonEndedSubmissions) {
      // find the endedQuestion which matches the submitted question
      const endedQuestion = endedQuestions.find(
        (q) => q._id.toString() === submission.question_id
      );

      if (endedQuestion) {
        // get correct answer
        const correctOption = endedQuestion.answers.find((q) => q.is_correct);
        const user = await User.findById(submission.user_id);

        // if answer is correct
        if (submission.selected_option === correctOption) {
          submission.points_awarded = 10;
          console.log({ user });
          user.correct_answers += 1;
          user.points += 10;

          // check if it fits in day
          if (
            submission.createdAt >= ranges.day.start &&
            submission.createdAt <= ranges.day.end
          ) {
            user.daily += 10;
          }

          // check if it fits in week
          if (
            submission.createdAt >= ranges.week.start &&
            submission.createdAt <= ranges.week.end
          ) {
            user.weekly += 10;
          }
          // check if it fits in month
          if (
            submission.createdAt >= ranges.month.start &&
            submission.createdAt <= ranges.month.end
          ) {
            user.monthly += 10;
          }
          // check if it fits in year
          if (
            submission.createdAt >= ranges.year.start &&
            submission.createdAt <= ranges.year.end
          ) {
            user.yearly += 10;
          }
        } else {
          submission.points_awarded = 0;
        }

        // update submission and user
        submission.points_calculated = true;
        user.total_questions_answered += 1;
        await submission.save();
        await user.save();
        testUser.push(user);
      }
    }
    res.send({ users, nonEndedSubmissions, testArry });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports = {
  signUp,
  getUserStats,
  login,
  verifyOTPSignUp,
  getAllUsers,
  forgotPassword,
  resetPassword,
  verifyOTP,
  logout,
  makeFavoriteTeam,
  getFavoriteTeams,
  unmakeFavoriteTeam,
  newStats,
  giveAllUserPoints,
};
