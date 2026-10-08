const express = require("express");

const authController = require("../controllers/auth_controller.js");

const { validate } = require("../middlewares/validate_middleware.js");

const {
    signupSchema,
    loginSchema
} = require("../schemas/auth_schema.js");

const router = express.Router();

router.post(
    "/signup",
    validate(signupSchema, "body"),
    authController.signup
);

router.post(
    "/login",
    validate(loginSchema, "body"),
    authController.login
);

module.exports = router;