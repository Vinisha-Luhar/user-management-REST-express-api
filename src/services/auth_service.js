const User = require("../models/user_model.js");
const session = require("../models/session_model.js");
const AppError = require("../utils/app_error.js");

const {
    hashPassword,
    comparePassword
} = require("../utils/password.js");

const {
    generateRefreshToken,
    hashToken
} = require("../utils/token.js");

const {
    generateAccessToken
} = require("../utils/jwt.js");

const signup = async (data) => {

    const existingUser = await User.findOne({
        email: data.email
    });

    if (existingUser) {
        throw new AppError(
            "Unable to create account",
            409
        );
    }

    const passwordHash = await hashPassword(
        data.password
    );

    const user = await User.create({
        name: data.name,
        email: data.email,
        passwordHash
    });

    return user;
};


const login = async (data) => {

    const user = await User.findOne({
        email: data.email
    }).select("+passwordHash");

    if (!user) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    if (!user.isActive) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    const isPasswordValid = await comparePassword(
        data.password,
        user.passwordHash
    );

    if (!isPasswordValid) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    user.lastLoginAt = new Date();

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    await session.create({
        userId: user._id,
        refreshTokenHash,
        expiresAt
    });

    console.log("LOGIN USER:", user);
console.log("ACCESS TOKEN:", accessToken);
console.log("REFRESH TOKEN:", refreshToken);

    return {
        user,
        accessToken,
        refreshToken
    };
};


module.exports = {
    signup,
    login
};