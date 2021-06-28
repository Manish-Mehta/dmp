require('dotenv').config();

const express = require("express");
const checkJwt = require("./utils/checkJwt");

const PORT = process.env.PORT || 3004;

const app = express();

app.get("/api/protected", checkJwt, (req, res) => {
  console.log("token needs to be validated");
  res.json({ message: "Super secret stuff" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
