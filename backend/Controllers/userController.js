const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const User = require("../Models/userModel");

//Get All Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
  // next();
});

//checkRole middleware used to check if the user has the required role
exports.checkRole = (role) => {
  return (req, res, next) => {
    // Get the user's role from their data
    const userRole = req.user.role;

    if (userRole !== role) {
      return res
        .status(401)
        .json({ error: "Unauthorized, insufficient permissions" });
    }

    next();
  };
};

exports.getUserNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  console.log(`User ID:`, userId);
  try {
    const user = await User.findById(userId).populate("notifications");
    return user.notifications;
  } catch (error) {}
});
