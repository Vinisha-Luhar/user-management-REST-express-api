const express = require('express');


const logger = require('./middlewares/logger_middleware.js');
const errorHandler = require('./middlewares/error_middleware.js');
const employeeRoutes = require('./routes/employee_routes.js');

const app = express();

app.use(express.json());

app.use(logger);

app.use("/api/v1/employees", employeeRoutes);

app.use(errorHandler);

module.exports = app;