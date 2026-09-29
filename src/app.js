const express = require('express');
const logger = require('./middlewares/logger_middleware.js');
const userRoutes = require('./routes/user_routes.js');

const app = express();

app.use(express.json());
app.use(logger);

app.use("/users", userRoutes);

module.exports = app;