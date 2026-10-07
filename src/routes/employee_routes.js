const express = require('express');
const employeeController = require('../controllers/employee_controller.js');
// const {validateCreateEmployee,
//     validateEmployeeIdParam,
//     validateEmployeeQuery,
//     validateUpdateEmployee} = require('../middlewares/validate_middleware.js');
const {validate} = require('../middlewares/validate_middleware.js');
const {
    createEmployeeSchema,
    updateEmployeeSchema,
    employeeIdSchema,
    employeeQuerySchema
} = require("../schemas/employee_schema.js");

const router = express.Router();

// router.post("/",validateCreateEmployee,employeeController.createEmployee);
// router.get("/",validateEmployeeQuery,employeeController.getEmployees);
// router.get("/:id",validateEmployeeIdParam,employeeController.getEmployeeById);
// router.patch("/:id",validateEmployeeIdParam,validateUpdateEmployee,employeeController.updateEmployee);
// router.delete("/:id",validateEmployeeIdParam,employeeController.deleteEmployee);

router.post("/",validate(createEmployeeSchema,"body"),employeeController.createEmployee);
router.get("/",validate(employeeQuerySchema,"query"),employeeController.getEmployees);
router.get("/:id",validate(employeeIdSchema,"params"),employeeController.getEmployeeById);
router.patch("/:id",validate(employeeIdSchema,"params"),validate(updateEmployeeSchema,"body"),employeeController.updateEmployee);
router.delete("/:id",validate(employeeIdSchema,"params"),employeeController.deleteEmployee);


module.exports = router;