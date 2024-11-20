// src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes'); // Pfad zu routes.js

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/api', routes); // Basispfad für API-Routen

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
