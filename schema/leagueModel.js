const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeagueSchema = new Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  teamId: { type: String, required: true },
  // teamId: { type: Schema.Types.ObjectId, ref: "Team" },
});

const League = mongoose.model("League", LeagueSchema);

module.exports = League;
