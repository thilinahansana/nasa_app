const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
//Load Environment Configs
dotenv.config({ path: "./config.env" });

//require app.js
const app = require("./app");

//Database Connection
const DB = process.env.DATABASE_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.error("Error connecting to DB:", err.message);
    process.exit(1);
  });

// Run this system on port 3000
const port = process.env.PORT || 8000;

//start server
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
