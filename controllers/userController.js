const bcrypt = require("bcrypt");
const User = require("../schema/userModel");
const { generateOTP, generateToken } = require("../helper/generateToken");
const Team = require("../schema/teamModel");
const sgMail = require("@sendgrid/mail");
const Submission = require("../schema/submissionModel");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    console.error("Error in login:", error);
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

const makeFavoriteTeam = async (req, res) => {
  const { userId, teamId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const team = await Team.findById(teamId);
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    if (!user.teamId.includes(teamId)) {
      user.teamId.push(teamId);
      await user.save();
    }

    res.json({ message: "Favorite team added successfully", user });
  } catch (error) {
    console.error("Error in making favorite team:", error);
    res.status(500).json({ message: "Server error" });
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

const getFavoriteTeams = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("teamId");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const favoriteTeams = user.teamId;
    res.json({ favoriteTeams });
  } catch (error) {
    console.error("Error in getting favorite teams:", error);
    res.status(500).json({ message: "Server error" });
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

const newStats = async (req, res) => {
  try {
    const predictions = await Submission.find({
      userId: req.params.userId,
    }).populate("question_id");
    let total, right;
    predictions.map((p) => {
      p.question_id.answers.filter((a) => {
        if (a._id == p.selected_option) {
          total += 1;
          if (a.is_correct == true) right += 1;
        }
      });
    });
    console.log({ total, right });
    res.send({ total, right });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
};
