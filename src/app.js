const express = require('express');


const logger = require('./middlewares/logger_middleware.js');
const errorHandler = require('./middlewares/error_middleware.js');
const userRoutes = require('./routes/user_routes.js');

const app = express();

app.use(express.json());

app.use(logger);

app.use("/users", userRoutes);

app.use(errorHandler);

module.exports = app;