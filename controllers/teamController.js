const Team = require("../schema/teamModel");

const createTeam = async (req, res) => {
  try {
    const { image, name } = req.body;
    const team = new Team({ image, name });
    const savedTeam = await team.save();
    res.json(savedTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTeamById = async (req, res) => {
  try {
    const { image, name } = req.body;
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { image, name },
      { new: true }
    );
    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(updatedTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteTeamById = async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeamById,
  deleteTeamById,
};
