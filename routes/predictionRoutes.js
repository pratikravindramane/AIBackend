const express = require("express");
const router = express.Router();
const predictionController = require("../controllers/predictionController");
const userController = require("../controllers/userController");

// Submit a prediction question and selected option
router.post("/submit-prediction", predictionController.submitPrediction);

// Fetch user points and stats
router.get("/user/:user_id/stats", userController.getUserStats);

router.get("/user/:user_id/newstats", userController.getUserStats);

// Fetch all submitted prediction questions with results for a user
router.get(
  "/user/:user_id/prediction-submissions",
  predictionController.getUserPredictionSubmissions
);

// Get all open prediction questions that the user has not submitted
router.get(
  "/user/:user_id/open-predictions",
  predictionController.getOpenPredictionQuestions
);

module.exports = router;
