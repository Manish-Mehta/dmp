require('dotenv').config();

const app = require("express")();

const PORT = process.env.PORT || 3004;

app.use('/', require('./routes'));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
