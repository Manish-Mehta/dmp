require('dotenv').config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3004;

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use('/', require('./routes'));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
