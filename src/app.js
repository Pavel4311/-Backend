const express = require("express");
const mortgageProfilesRoutes = require("./routes/mortgageProfiles.routes");

const app = express();

app.use(express.json());
app.use(mortgageProfilesRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
