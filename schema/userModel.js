const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  // teamId: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Team",
  //   },
  // ],
  // leagueId: {
  //   type: [Schema.Types.ObjectId],
  //   ref: "League",
  //   default: [],
  // },
  teamId: [
    {
      type: String,
    },
  ],
  leagueId: [
    {
      type: String,
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  dob: {
    type: Date,
  },
  otp: {
    type: String,
    default: undefined,
  },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  socialProvider: {
    type: String,
    enum: ["google", "facebook"],
  },
  socialId: String,
  points: { type: Number, default: 0 },
  total_questions_answered: { type: Number, default: 0 },
  correct_answers: { type: Number, default: 0 },
  dailyPoints: { type: Number, default: 0 },
  weeklyPoints: { type: Number, default: 0 },
  monthlyPoints: { type: Number, default: 0 },
  yearlyPoints: { type: Number, default: 0 },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
