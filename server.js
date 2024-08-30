const express = require('express');
const constollerRouting = require('./routes/index');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(constollerRouting);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
