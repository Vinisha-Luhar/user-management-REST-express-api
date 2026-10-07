/// Validation Without ZOD

// const mongoose = require("mongoose");
// const appError = require("../utils/app_error.js");

// const isNonEmptyString = (value) => {
//     return (
//         typeof value === "string" && value.trim().length > 0
//     );
// };

// const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
// };

// const isValidPhone = (phone) => {
//     const phoneRegex = /^[0-9]{10}$/;
//     return phoneRegex.test(phone);
// };

// const isValidDate = (value) => {
//     const date = new Date(value);
//     return !Number.isNaN(date.getTime());
// };

// const allowedStatuses = [
//     "active",
//     "inactive",
//     "on_leave"
// ];

// const validateCreateEmployee = (req,res,next) => {

//     console.log("REQUEST BODY:", req.body);
//     const body = req.body;

//     const allowedFields = [
//         "firstName",
//         "lastName",
//         "email",
//         "phone",
//         "department",
//         "salary",
//         "designation",
//         "joiningDate",
//         "status"
//     ];

//     const errors = [];

//     //check unknown fields
//     const unknownFields = Object.keys(body).filter(field => !allowedFields.includes(field));

//     if(unknownFields.length > 0){
//         errors.push({
//             field: unknownFields.join(","),
//             message: "Unknown fields"
//         });
//     }

//     //firstName
//     if(!isNonEmptyString(body.firstName)){
//         errors.push({
//             field: "firstName",
//             message: "First Name is Required"
//         });
//     }
//     else if(body.firstName.trim().length < 2 || body.firstName.trim().length > 50){
//         errors.push({
//             field: "firstName",
//             message: "First Name must be between 2 and 50 characters"
//         });
//     }

//     //lastName
//     if(!isNonEmptyString(body.lastName)){
//         errors.push({
//             field: "lastName",
//             message: "Last Name is Required"
//         });
//     }
//     else if(body.lastName.trim().length < 2 || body.lastName.trim().length > 50){
//         errors.push({
//             field: "LastName",
//             message: "Last Name must be between 2 and 50 characters"
//         });
//     }

//     //email
//     if(!isNonEmptyString(body.email)){
//         errors.push({
//             field: "email",
//             message: "Email if Required"
//         });
//     }
//     else if(!isValidEmail(body.email.trim())){
//         errors.push({
//             field: "email",
//             message: "Invalid Email Format"
//         });
//     }

//     //phone
//     if(!isNonEmptyString(body.phone)){
//         errors.push({
//             field: "phone",
//             "message": "Phone is Required"
//         });
//     }
//     else if(!isValidPhone(body.phone.trim())){
//         errors.push({
//             field: "phone",
//             message: "Phone must contain exactly 10 digits"
//         })
//     }

//     //department
//     if(!isNonEmptyString(body.department)){
//         errors.push({
//             field: "department",
//             message: "Department is Required"
//         });
//     }

//     //designation
//     if(!isNonEmptyString(body.designation)){
//         errors.push({
//             field: "designation",
//             message: "Designation is Required"
//         });
//     }

//     //salary
//     if(typeof body.salary !== "number" || !Number.isFinite(body.salary)){
//         errors.push({
//             field: "salary",
//             message: "Salary must be a Valid Number"
//         });   
//     }
//     else if(body.salary < 0){
//         errors.push({
//             field: "salary",
//             message: "Salary cannot be Negative"
//         });
//     }

//     //joiningDate
//     if(!body.joiningDate){
//         errors.push({
//             field: "joiningDate",
//             message: "Joining Date is Required"
//         });
//     }
//     else if(!isValidDate(body.joiningDate)){
//         errors.push({
//             field: "joiningDate",
//             message: "Invalid Joining Date"
//         });
//     }

//     //status
//     if(!body.status || !allowedStatuses.includes(body.status)){
//         errors.push({
//             field: "status",
//             message: "Invalid Employee Status"
//         });
//     }

//     //Return All Validation Errors
//     if(errors.length > 0){
//         return res.status(422).json({
//             success: false,
//             message: "Validation Failed",
//             errors
//         });
//     }

//     next();
// };

// const validateEmployeeIdParam = (req, res, next) => {
//     const {id} = req.params;

//     if(!mongoose.Types.ObjectId.isValid(id)){
//         return res.status(400).json({
//             success: false,
//             message: "Invalid Employee ID"
//         });
//     }

//     next();
// };

// const validateEmployeeQuery = (req,res,next) => {
//     const errors = [];
//     const {page, limit, search, department, status} = req.query;

//     //page
//     if(page !== undefined){
//         const pageNumber = Number(page);

//         if(!Number.isInteger(pageNumber) || pageNumber < 1){
//             errors.push({
//                 field: "page",
//                 message: "Page must be a Positive Number"
//             });
//         }
//     }

//     //limit
//     if(limit !== undefined){
//         const limitNumber = Number(limit);

//         if(!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 100){
//             errors.push({
//                 field: "limit",
//                 message: "Limit must be an Integer between 1 and 100"
//             });
//         }
//     }

//     //search
//     if(search !== undefined && (typeof search !== "string" || search.trim().length < 2)){
//         errors.push({
//             field: "search",
//             message: "Search Must Contain At Least 2 Characters"
//         });
//     }

//     //department
//     if(department !== undefined && !isNonEmptyString(department)){
//         errors.push({
//             field: "department",
//             message: "Department cannot be Empty"
//         });
//     }

//     //status
//     if(status !== undefined && !allowedStatuses.includes(status)){
//         errors.push({
//             field: "status",
//             message: "Invalid Employee Status"
//         });
//     }

//     if(errors.length > 0){
//         return res.status(422).json({
//             success: false,
//             message: "Invalid Query Parameters",
//             errors
//         });
//     }

//     next();
// };

// const validateUpdateEmployee = (req, res, next) => {
//     const allowedFields = [
//         "firstName",
//         "lastName",
//         "email",
//         "phone",
//         "department",
//         "designation",
//         "salary",
//         "joiningDate",
//         "status"
//     ];

//     const errors = [];

//     const field = Object.keys(req.body);

//     //Reject Unknown Fields
//     const unknownFields = field.filter(field => !allowedFields.includes(field));

//     if(unknownFields.length > 0){
//         errors.push({
//             field: unknownFields.join(","),
//             message: "Unknown Fields"
//         });
//     }

//     // Empty PATCH body
//     if(field.length === 0){
//         errors.push({
//             field: "body",
//             message: "At Least one field is Required"
//         });
//     }

//     //firstName
//     if(req.body.firstName !== undefined){
//         if(!isNonEmptyString(req.body.firstName)){
//             errors.push({
//                 field: "firstName",
//                 message: "First Name Must be a Non Empty String"
//             });
//         }
//         else if(req.body.firstName.trim().length < 2 || req.body.firstName.trim().length > 50){
//             errors.push({
//                 field: "firstName",
//                 message: "First Name must be between 2 and 50 Characters"
//             });
//         }
//     }

//     //email
//     if(req.body.email !== undefined){
//         if(typeof req.body.email !== "string" || !isValidEmail(req.body.email.trim())){
//             errors.push({
//                 field: "email",
//                 message: "Invalid Email Format"
//             })
//         }
//     }

//     //salary
//     if(req.body.salary !== undefined){
//         if(typeof req.body.salary !== "number" || !Number.isFinite(req.body.salary) || req.body.salary < 0){
//             errors.push({
//                 field: "salary",
//                 message: "Salary Must be a Non Negative Number"
//             });
//         }
//     }

//     //status
//     if(req.body.status !== undefined && !allowedStatuses.includes(req.body.status)){
//         errors.push({
//             field: "status",
//             message: "Invalid Employee Status"
//         });
//     }

//     if(errors.length > 0){
//         return res.status(422).json({
//             success: false,
//             message: "Validation Failed",
//             errors
//         });
//     }

//     next();
// }

// // function validateEmployeeId(req, res, next){
// //     if(!req.params.id || typeof req.params.id !== "string" || req.params.id.trim().length === 0){
// //         res.status(400).json({
// //             message: "Invalid Employee ID"
// //         });
// //     }
// //     else{
// //         next();
// //     }    
// // };

// module.exports = {
//     validateCreateEmployee,
//     validateEmployeeIdParam,
//     validateEmployeeQuery,
//     validateUpdateEmployee
// };




/// Validation with ZOD
const validate = (schema,source = "body") => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);

        if(!result.success){
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }));

            return res.status(422).json({
                success: false,
                message: "Validation Failed",
                errors
            });
        }

        req[source] = result.data;
        next();
    };
};


module.exports = { validate };