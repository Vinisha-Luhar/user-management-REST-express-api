const express = require('express');
const employeeController = require('../controllers/employee_controller.js');
const {validateCreateEmployee,
    validateEmployeeIdParam,
    validateEmployeeQuery,
    validateUpdateEmployee} = require('../middlewares/validate_middleware.js');

const router = express.Router();

router.post("/",validateCreateEmployee,employeeController.createEmployee);
router.get("/",validateEmployeeQuery,employeeController.getEmployees);
router.get("/:id",validateEmployeeIdParam,employeeController.getEmployeeById);
router.patch("/:id",validateEmployeeIdParam,validateUpdateEmployee,employeeController.updateEmployee);
router.delete("/:id",validateEmployeeIdParam,employeeController.deleteEmployee);

module.exports = router;