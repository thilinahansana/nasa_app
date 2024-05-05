const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const AppError = require("./utils/appError");
const userRouter = require("./Routes/userRouter");

const app = express();

// Implement CORS: Allow CORS for all incoming requests to our API.
app.use(
  cors({
    origin: "https://nasa-app-chi.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false }));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// app.use(cookieParser()) is setting up a middleware that will parse incoming request
// headers for cookies and make them available on the request object.
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// ROUTES
app.use("/api/v1/users", userRouter);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
