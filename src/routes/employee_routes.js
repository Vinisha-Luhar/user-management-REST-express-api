const express = require('express');
const employeeController = require('../controllers/employee_controller.js');

const router = express.Router();

router.post("/",employeeController.createEmployee);
router.get("/",employeeController.getEmployees);
router.get("/:id",employeeController.getEmployeeById);
router.patch("/:id",employeeController.updateEmployee);
router.delete("/:id",employeeController.deleteEmployee);

module.exports = router;