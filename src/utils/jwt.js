const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRES_IN = "15m";

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN
        }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    );
};

module.exports = {
    generateAccessToken,
    verifyAccessToken
};