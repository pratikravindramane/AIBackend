const League = require("../schema/leagueModel");
const User = require("../schema/userModel");

const createLeague = async (req, res) => {
  try {
    const { image, name, leagueId } = req.body;
    const league = new League({ image, name, leagueId });
    const savedLeague = await league.save();
    res.json(savedLeague);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllLeagues = async (req, res) => {
  try {
    const leagues = await League.find();
    res.json(leagues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLeagueById = async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) {
      return res.status(404).json({ message: "League not found" });
    }
    res.json(league);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateLeagueById = async (req, res) => {
  try {
    const { image, name } = req.body;
    const updatedLeague = await League.findByIdAndUpdate(
      req.params.id,
      { image, name },
      { new: true }
    );
    if (!updatedLeague) {
      return res.status(404).json({ message: "League not found" });
    }
    res.json(updatedLeague);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteLeagueById = async (req, res) => {
  try {
    const deletedLeague = await League.findByIdAndDelete(req.params.id);
    if (!deletedLeague) {
      return res.status(404).json({ message: "League not found" });
    }
    res.json({ message: "League deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const makeFavoriteLeague = async (req, res) => {
  const { userId, leagueId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const team = await League.findById(leagueId);
    if (!team) {
      res.status(404).json({ message: "League not found" });
      return;
    }

    if (!user.leagueId.includes(leagueId)) {
      user.leagueId.push(leagueId);
      await user.save();
    }

    res.json({ message: "Favorite team added successfully", user });
  } catch (error) {
    console.error("Error in making favorite team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const unmakeFavoriteLeague = async (req, res) => {
  const { userId, leagueId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const index = user.leagueId.indexOf(leagueId);
    if (index === -1) {
      res
        .status(400)
        .json({ message: "League not found in user's favorite teams" });
      return;
    }

    user.leagueId.splice(index, 1);
    await user.save();

    res.json({ message: "Favorite team removed successfully", user });
  } catch (error) {
    console.error("Error in unmaking favorite team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getFavoriteLeague = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("leagueId");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const favoriteleagueId = user.leagueId;
    res.json({ favoriteleagueId });
  } catch (error) {
    console.error("Error in getting favorite teams:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createLeague,
  getAllLeagues,
  getLeagueById,
  updateLeagueById,
  deleteLeagueById,
  makeFavoriteLeague,
  unmakeFavoriteLeague,
  getFavoriteLeague,
};
