// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// ℹ️ Import helpers
require("./helpers");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
// The ./config/session.config exports a function that takes app as an argument
// This function creates the session and cookie
require("./config/session.config")(app);

// default value for title local
const projectName = "workoutapp";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `Workouty`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const createWorkoutRoutes = require("./routes/create-workout.routes.js");
app.use("/", createWorkoutRoutes);

const searchWorkoutRoutes = require("./routes/search-workout.routes.js");
app.use("/", searchWorkoutRoutes);

const authRoutes = require("./routes/auth.routes.js");
app.use("/", authRoutes);

const myWorkoutRoutes = require("./routes/workouts.routes.js");
app.use("/", myWorkoutRoutes);

const friendRoutes = require("./routes/friends.routes.js");
app.use("/", friendRoutes);

const userProfileRoutes = require("./routes/profiles.routes.js");
app.use("/", userProfileRoutes);
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
