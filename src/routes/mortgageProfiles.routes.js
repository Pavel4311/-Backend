const express = require("express");
const {
  createMortgageProfile,
  getMortgageProfile,
} = require("../controllers/mortgageProfiles.controller");

const router = express.Router();

router.post("/mortgage-profiles", createMortgageProfile);
router.get("/mortgage-profiles/:id", getMortgageProfile);

module.exports = router;
