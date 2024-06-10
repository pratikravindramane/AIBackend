const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  teamId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
  ],
  leagueId: {
    type: [Schema.Types.ObjectId],
    ref: "League",
    default: [],
  },
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
  socialProvider: {
    type: String,
    enum: ["google", "facebook"],
  },
  socialId: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
