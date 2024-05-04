const express = require("express");
const authController = require("../Controllers/authController");
const userController = require("../Controllers/userController");

const router = express.Router();

//AUTH routes

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);

router.get(
  "/getAllUsers",
  userController.checkRole("admin"),
  userController.getAllUsers
);

router.get("/notification", userController.getUserNotifications);

module.exports = router;
