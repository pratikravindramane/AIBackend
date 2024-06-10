const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

router.post("/createTeam", (req, res, next) => {
  teamController.createTeam(req, res, next);
});

router.get("/getAllTeams", (req, res, next) => {
  teamController.getAllTeams(req, res, next);
});

router.get("/getTeamById/:id", (req, res, next) => {
  teamController.getTeamById(req, res, next);
});

router.put("/updateTeamById/:id", (req, res, next) => {
  teamController.updateTeamById(req, res, next);
});

router.delete("/deleteTeamById/:id", (req, res, next) => {
  teamController.deleteTeamById(req, res, next);
});

module.exports = router;
