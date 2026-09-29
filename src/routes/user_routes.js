const express = require("express");

const router = express.Router();

const userController = require("../controllers/user_controller.js")

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);

module.exports = router;