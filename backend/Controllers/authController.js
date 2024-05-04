const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

//method to sign a jsonwebtoken
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// creates a JSON Web Token (JWT) and sends it to the client in a cookie.
const createSendToken = (user, statusCode, req, res) => {
  //sign the jwt
  const token = signToken(user._id);

  //store the JWT in the cookie named `jwt`
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // req.headers["x-forwarded-proto"] is a property in the request headers that indicates the protocol that was used by the client to make the request to the server.
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//signup user
exports.signup = catchAsync(async (req, res, next) => {
  //1) create user
  const newUser = await User.create({
    email: req.body.email,

    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${req.protocol}://${req.get("host")}/me`;

  //2)send successful signup email
  await new Email(newUser, url).sendWelcomeMessage();

  // 3) If everything ok, send token to client
  createSendToken(newUser, 200, req, res);

  // next();
});

//Login user
exports.login = catchAsync(async (req, res, next) => {
  //get email and password from req.body
  const { email, password } = req.body;

  // 1) Check if username and password exist
  if (!password || !email) {
    return res
      .status(400)
      .json({ error: "Please provide both email and password!" });
  }

  //2) Check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({ error: "Incorrect Email or Password" });
  }

  // 3) If everything is OK, send token to client
  createSendToken(user, 200, req, res);
});

//Logout user
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "You have successfully logged out.",
  });
};

//protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //Bearer vhdnvbscrwgdscvsdgcveghsdchd
    token = req.headers.authorization.split(" ")[1]; // this code will get the `vhdnvbscrwgdscvsdgcveghsdchd` part
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  //if token is NOT FOUND
  if (!token) {
    return res.status(401).json({
      error: "You are not logged in! Please log in to access this resource.",
    });
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded, 'DECODED TOKEN');

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return res.status(401).json({ error: "The user no longer exists." });
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res
      .status(401)
      .json({ error: "User recently changed password! Please log in again!" });
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  // res.locals.user = currentUser;

  next();
});

//Check if user is logged in or not
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

//forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on the POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res
      .status(404)
      .json({ error: "There is no user with that email address." });
  }

  // 2)Generate Random Reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send Reset token to User's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Password Reset token has been sent to your email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      error: "There was an error sending the email. Try again later!",
    });
  }
});

//Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Hash Token in the params
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2) Get user based on the token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 3) If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({ error: "Token is invalid or has expired" });
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

//Update Password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");
  // console.log(user, 'UPDATE PASS USER SEEN');
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return res.status(401).json({ error: "Your current password is wrong." });
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

// Middleware to restrict access based on user role
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
    }

    next();
  };
};
