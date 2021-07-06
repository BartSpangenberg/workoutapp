const router = require("express").Router();
const ExerciseModel = require("../models/Exercise.model");
const WorkoutModel = require("../models/Workout.model");
const UserWorkoutModel = require("../models/UserWorkout.model");
const { equipments, muscles } = require("../data/workoutData");
const {
  saveWorkoutDataInTheSession,
  turnSessionDataIntoWorkoutObject,
  resetSessionWorkoutData,
  createIsCreatingWorkoutVariable,
  createWorkoutObject,
  createNewExerciseObject,
  createNewExerciseToAddToSession,
  createUserWorkoutObject,
} = require("./library.helper");
const checkLoggedIn = require("../middlewares/loggedInMiddleware");
const navBarClasses = require('../data/navbarClasses');

// CREATE WORKOUT ROUTES
// For UX purposes create-workout page data needs to sustain through page switches.
// Form data is converted into session data and vice versa.
// Helper functions assist with various tasks of converting datatypes.

// createIsCreatingWorkoutVariable will later be removed when we create this variable on login
router.get(
  "/library/create-workout",
  createIsCreatingWorkoutVariable,
  resetSessionWorkoutData,
  checkLoggedIn,
  (req, res, next) => {
    // const { exerciseNames } = req.session.workout;

    let workoutObj = turnSessionDataIntoWorkoutObject(req);

    res.render("./library/create-workout.hbs", { workoutObj, navBarClasses });
  }
);

router.post("/library/create-workout", checkLoggedIn, (req, res, next) => {
  req.session.isCreatingWorkout = true;

  // Create-workout form has 3 buttons that have 3 different functions
  // All three buttons are part of the same form.
  // This is done to re-use the data from the form when the user comes back
  saveWorkoutDataInTheSession(req);

  if (req.body.button === "create-workout") {
    const { name, description } = req.body;
    if (!name || !description) {
      let error = "Please fill in all fields.";
      let workoutObj = turnSessionDataIntoWorkoutObject(req);
      res.render("./library/create-workout.hbs", { workoutObj, error, navBarClasses });
      return;
    }

    let newWorkout = createWorkoutObject(
      req.session.workout,
      req.session.userInfo
    );

    WorkoutModel.create(newWorkout)
      .then(() => {})
      .catch((err) => {
        console.log("Something went wrong while creating a new Workout", err);
        res.redirect("/library/create-workout");
      });

    let newUserWorkout = createUserWorkoutObject(
      req.session.workout,
      req.session.userInfo
    );

    UserWorkoutModel.create(newUserWorkout)
      .then(() => {
        req.session.isCreatingWorkout = false;
        res.send("Redirect to My Workouts");
      })
      .catch((err) => {
        console.log(
          "Something went wrong while creating a new UserWorkout",
          err
        );
        res.redirect("/library/create-workout");
      });
  } else if (req.body.button === "search-for-exercise") {
    // Store the searchword, this will later be used to search for the exercises
    req.session.exerciseSearchWord = req.body.findExercise;
    res.redirect("/library/create-workout/exercise-pop-up");
  } else {
    res.redirect("/library/create-exercise");
  }
});

router.get("/library/create-exercise", checkLoggedIn, (req, res, next) => {
  res.render("./library/create-exercise.hbs", { muscles, equipments, navBarClasses });
});

router.post("/library/create-exercise", checkLoggedIn, (req, res, next) => {
  const { name, description } = req.body;

  if (!name || !description) {
    let error = "Please fill in all fields.";
    res.render("./library/create-exercise.hbs", { muscles, equipments, error, navBarClasses });
    return;
  }

  let newExerciseForDatabase = createNewExerciseObject(
    req.body,
    muscles,
    equipments
  );

  ExerciseModel.create(newExerciseForDatabase)
    .then((exerciseData) => {
      // Add new created exercise to session
      // The id and name are not part of the form, to sustain the data through re-renders they are stored in separate variables
      req.session.workout.exerciseIds.push(exerciseData._id);
      req.session.workout.exerciseNames.push(exerciseData.name);
      let newExercise = createNewExerciseToAddToSession();
      req.session.workout.exercises.push(newExercise);

      res.redirect("/library/create-workout");
    })
    .catch((err) => {
      console.log("Something went wrong while creating a new exericse", err);
      res.redirect("/library/create-workout");
    });
});

router.get(
  "/library/create-workout/exercise-pop-up",
  checkLoggedIn,
  (req, res, next) => {
    const { exerciseSearchWord } = req.session;
    ExerciseModel.find({ name: { $regex: exerciseSearchWord, $options: "i" } })
      .then((exerciseData) => {
        res.render("library/exercise-pop-up.hbs", { exerciseData, navBarClasses });
      })
      .catch((err) => {
        console.log("Something went wrong while searching for exercises", err);
        // Display error message if no data is present.
        res.render("library/exercise-pop-up.hbs", { exerciseData, navBarClasses });
      });

    // If nothing is found --> display create exercise button
  }
);

router.post(
  "/library/create-workout/exercise-pop-up",
  checkLoggedIn,
  (req, res, next) => {
    const { exerciseId } = req.body;
    ExerciseModel.findById(exerciseId)
      .then((singleExercise) => {
        req.session.workout.exerciseIds.push(singleExercise._id);
        req.session.workout.exerciseNames.push(singleExercise.name);
        req.session.workout.exercises.push(createNewExerciseToAddToSession());
        res.redirect("/library/create-workout");
      })
      .catch((err) => {
        console.log(
          "Something went wrong while searching for a single exercise",
          err
        );
      });
  }
);

module.exports = router;
