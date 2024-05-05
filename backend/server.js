const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Handle uncaught exceptions globally
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Load environment configurations
dotenv.config({ path: "./config.env" });

// Require app.js
const app = require("./app");

// Database Connection
const DB = process.env.DATABASE_URI;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log("DB connection successful!"))
.catch((err) => {
  console.error("Error connecting to DB:", err.message);
  process.exit(1);
});

// Specify the port to listen on
const port = process.env.PORT || 8000;

// Start the server
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
