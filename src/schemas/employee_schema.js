const {z} = require("zod");
const mongoose = require("mongoose");

const createEmployeeSchema = z.object({

    firstName: z.string().trim()
    .min(2,"First Name Must be Atleast 2 Characters")
    .max(50,"First Name Must not Exceed 50 Characters"),

    lastName: z.string().trim()
    .min(2,"Last Name Must be Atleast 2 Characters")
    .max(50,"Last Name Must not Exceed 50 Characters"),

    email: z.string().trim().email("Invalid Email Format"),

    phone: z.string().regex(/^[0-9]{10}$/,"Phone Must Contain Atleast 10 Digits"),

    department: z.string().trim().min(1,"Department is Required"),

    designation: z.string().trim().min(1,"Designation is Required"),

    salary: z.number().finite().nonnegative("Salary Cannot be Negative"),

    joiningDate: z.string()
    .refine((value)=>!Number.isNaN(new Date(value).getTime()),"Invalid Joining Date"),

    status: z.enum(["active","inactive","on_leave"],{
        message: "Invalid Employee Status"
    }),
}).strict();

const updateEmployeeSchema = createEmployeeSchema
.partial()
.refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required for update"
    }
);

const employeeIdSchema = z.object({
    id: z.string().refine(
        (id) => mongoose.Types.ObjectId.isValid(id),
        {
            message: "Invalid Employee Id"
        }
    )
});

const employeeQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    department: z.string().trim().optional(),
    status: z.enum(["active","inactive","on_leave"]).optional()
}).strict();

module.exports = {
    createEmployeeSchema,
    updateEmployeeSchema,
    employeeIdSchema,
    employeeQuerySchema
};