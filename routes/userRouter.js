const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", (req, res, next) => {
  userController.signUp(req, res, next);
});

router.post("/login", (req, res, next) => {
  userController.login(req, res, next);
});

router.get("/users", (req, res, next) => {
  userController.getAllUsers(req, res, next);
});

router.post("/forgot-password", (req, res, next) => {
  userController.forgotPassword(req, res, next);
});

router.post("/reset-password", (req, res, next) => {
  userController.resetPassword(req, res, next);
});

router.post("/verify-otp", (req, res, next) => {
  userController.verifyOTP(req, res, next);
});

router.post("/verifyOTPSignUp", (req, res, next) => {
  userController.verifyOTPSignUp(req, res, next);
});

router.post("/logout", (req, res, next) => {
  userController.logout(req, res, next);
});

router.post("/unmakeFavoriteTeam", (req, res, next) => {
  userController.unmakeFavoriteTeam(req, res, next);
});

router.post("/makeFavoriteTeam", (req, res, next) => {
  userController.makeFavoriteTeam(req, res, next);
});

router.get("/getFavoriteTeams/:userId", (req, res, next) => {
  userController.getFavoriteTeams(req, res, next);
});
router.get("/give-points-to-users", (req, res, next) => {
  userController.giveAllUserPoints(req, res, next);
});
router.get("/leaderboard",(req,res,next)=>{
  userController.leaderboard(req,res,next)
})
module.exports = router;
