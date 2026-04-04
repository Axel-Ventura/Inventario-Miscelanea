const express = require('express');
const app = express();

const db = require('./config/db'); //  importar conexión

app.use(express.json());
module.exports = app;