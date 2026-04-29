const express = require("express");
const rateLimit = require("express-rate-limit");
const mortgageProfilesRoutes = require("./routes/mortgageProfiles.routes");

const app = express();

app.use(express.json());
const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(apiLimiter);
app.use(mortgageProfilesRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
