const authService = require("../services/auth_service.js");
const asyncHandler = require("../utils/async_handler.js");


const signup = asyncHandler(async (req, res) => {

    const user = await authService.signup(req.body);

    res.status(201).json({
        success: true,
        message: "Account created successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});


const login = asyncHandler(async (req, res) => {

    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});


module.exports = {
    signup,
    login
};