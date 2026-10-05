const mongoose = require('mongoose');

const employeeService = require('../services/employee_service.js');
const asyncHandler = require('../utils/async_handler.js');
const appError = require('../utils/app_error.js');

const createEmployee = asyncHandler((async(req, res)=>{
    const employee = await employeeService.createEmployee(req.body);

    res.status(201).json({
        success: true,
        message: "Employee Created Successfully",
        data: employee
    });
}));

const getEmployees = asyncHandler((async (req,res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 10),1),100);

    const {search, department, status} = req.query;

    const result = await employeeService.getEmployees({
        page,
        limit,
        search,
        department,
        status
    });

    res.status(200).json({
        success: true,
        data: result.employees,
        pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
        }
    });
}));

const getEmployeeById = asyncHandler((async (req,res)=>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new appError("Invalid Employee Id",400);
    }

    const employee = await employeeService.getEmployeeById(id);

    if(!employee){
        throw new appError("Employee Not Found",404);
    }

    res.status(200).json({
        success: true,
        data: employee
    });
}));

const updateEmployee = asyncHandler((async (req,res)=>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new appError("Invalid Employee ID",400);
    }

    const employee = await employeeService.updateEmployee(id, req.body);

    if(!employee){
        throw new appError("Employee Not Found",404);
    }

    res.status(200).json({
        success: true,
        message: "Employee Updated Succesfully",
        data: employee
    });
}));

const deleteEmployee = asyncHandler((async (req,res)=>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new appError("Invalid Employee ID",400);
    }

    const employee = await employeeService.deleteEmployee(id);

    if(!employee){
        throw new appError("Employee Not Found", 404);
    }

    res.status(204).send();
}));

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
}