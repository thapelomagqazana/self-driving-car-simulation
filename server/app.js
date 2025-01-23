const express = require("express");

const app = express();

app.get('/', (req, res) => {
    res.send('Self-Driving Car Simulation Server');
});

module.exports = app;