const Employee = require('../models/employee_model.js');

const createEmployee = async(employeeData) => {
    return await Employee.create(employeeData);
}

const getEmployees= async({
    page,
    limit,
    search,
    department,
    status
})=>{

    const filter = {};

    if(department){
        filter.department = department;
    }

    if(status){
        filter.status = status;
    }

    if(search){
        filter.$or = [
            {
                firstName: {
                    $regex: search,
                    $options: 'i'
                }
            },
            {
                lastName: {
                    $regex: search,
                    $options: 'i'
                }
            },
            {
                email: {
                    $regex: search,
                    $options: 'i'
                }
            },
        ];
    }

    const skip = (page - 1) * limit;

    const [employees,total] = await Promise.all([
        Employee.find(filter)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit),

        Employee.countDocuments(filter)
    ]);

    return {
        employees,
        total
    };
};


const getEmployeeById = async (id) => {
    return await Employee.findById(id);
}

const updateEmployee = async(id, employeeData) => {
    return await Employee.findByIdAndUpdate(id,employeeData,{
        new: true,
        runValidators: true
    });
};

const deleteEmployee = async(id) => {
    return await Employee.findByIdAndDelete(id);
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};