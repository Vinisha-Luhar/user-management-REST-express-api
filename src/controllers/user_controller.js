const appError = require('../utils/app_error.js');
const asyncHandler = require('../utils/async_handler.js');

const users=[
    {
        id:1,
        name:"Mayur",
        email:"mayur@gmail.com",
    },
    {
        id:2,
        name:"Vinisha",
        email:"vinisha@gmail.com",
    }
];

const getUsers = asyncHandler(async (req,res) => {
    const users = await users.find();
    res.status(200).json({
        success: true,
        data: users
    });
});

const getUserById = (req, res,next) => {
    const id= Number(req.params.id);
    const user = users.find(user => user.id === id);
    if(!user){
        return next(new appError('User not found',404));
    }
    res.status(200).json({
        success: true,
        data: user
    });
};

const createUser = (req,res,next)=>{
    const {name,email} = req.body;

    if(!name || !email){
        return next(new appError("Name and Email are required",400));
    }

    const newUser = {
        id: users.length + 1,
        name: name,
        email: email
    };
    users.push(newUser);
    res.status(201).json({
        success: true,
        message: "User Created Successfully",
        user: newUser
    });
};

module.exports = {
    getUsers,
    getUserById,
    createUser
}