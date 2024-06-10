const express = require("express");
const router = express.Router();
const leagueController = require("../controllers/leagueController");

router.post("/createLeague", (req, res, next) => {
  leagueController.createLeague(req, res, next);
});

router.get("/getAllLeagues", (req, res, next) => {
  leagueController.getAllLeagues(req, res, next);
});

router.get("/getLeagueById/:id", (req, res, next) => {
  leagueController.getLeagueById(req, res, next);
});

router.put("/updateLeagueById/:id", (req, res, next) => {
  leagueController.updateLeagueById(req, res, next);
});

router.delete("/deleteLeagueById/:id", (req, res, next) => {
  leagueController.deleteLeagueById(req, res, next);
});

router.post("/favorite", (req, res, next) => {
  leagueController.makeFavoriteLeague(req, res, next);
});

router.get("/favorite/:userId", (req, res, next) => {
  leagueController.getFavoriteLeague(req, res, next);
});

router.delete("/favorite", (req, res, next) => {
  leagueController.unmakeFavoriteLeague(req, res, next);
});

module.exports = router;
