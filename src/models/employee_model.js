const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
{
    firstName:{
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    phone:{
        type: String,
        required: true,
        trim: true,
    },
    department:{
        type: String,
        required: true,
        trim: true,
    },
    designation:{
        type: String,
        required: true,
        trim:true
    },
    salary:{
        type:Number,
        required: true,
        min: 0
    },
    joiningDate:{
        type: Date,
        required: true,
    },
    status:{
        type: String,
        enum:["active","inactive","on_leave"],
        default: "active"
    }
},
{
    timestamps: true
}
);

const Employee = mongoose.model('Employee',employeeSchema);

module.exports = Employee;