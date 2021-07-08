const router = require("express").Router();
const ExerciseModel = require("../models/Exercise.model");
const WorkoutModel = require("../models/Workout.model");
const UserWorkoutModel = require("../models/UserWorkout.model");
const UserModel = require("../models/User.model");
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
  copyUserWorkoutDocumentSwapFriendAndOwner
} = require("./library.helper");
const checkLoggedIn = require("../middlewares/loggedInMiddleware");
const navBarClasses = require('../data/navbarClasses');
const { checkIfUserHasFriends } = require("../middlewares/friendMiddleware");

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
      .then((latestCreatedWorkout) => {
        req.session.isCreatingWorkout = false;
        req.session.latestCreatedWorkout = latestCreatedWorkout;
        res.redirect("/library/create-workout/friends");
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

router.get('/library/create-workout/friends', checkIfUserHasFriends, async (req, res, next) => {
  let userId = req.session.userInfo._id;
  try {
    let loggedInUser = await UserModel.findById(userId).populate('friends');
    res.render('library/add-friend.hbs', loggedInUser);
  }
  catch(err) {
    res.redirect('/myworkouts')
  }
})

router.post('/library/create-workout/friends', async (req, res, next) => {
  const { friendId }  = req.body;
  const lastWorkoutId = req.session.latestCreatedWorkout._id;
  try {
    await UserModel.findByIdAndUpdate(friendId, {  $push: { workoutRequests: lastWorkoutId }} );
    res.redirect('/library/create-workout/date');
  }
  catch(err) {
      res.redirect('/library/create-workout/date');
  }
})

router.get('/library/create-workout/date', (req, res, next) => {
  res.render('library/add-date.hbs')
})

router.post('/library/create-workout/date', async (req, res, next) => {
  const { newDate } = req.body;
  const lastWorkoutId = req.session.latestCreatedWorkout._id;
 
  try {
    await UserWorkoutModel.findByIdAndUpdate(lastWorkoutId, {  date: newDate  } );
    res.redirect('/myworkouts');
  }
  catch(err) {
      res.redirect('/myworkouts');
  }
})

router.get('/library/create-workout/workout-request', async (req, res, next) => {
  let userWorkoutId = req.session.workoutRequests[0]
  try {
    let userWorkout = await UserWorkoutModel.findById(userWorkoutId).populate('userId')
    req.session.userThatSendWorkoutRequestId = userWorkout.userId._id;
    req.session.userWorkoutSend = userWorkout;
    res.render('friends/workout-request.hbs', { userWorkout });
  }
  catch(err) {
    res.redirect('/myworkouts')
  }
})

router.post('/library/create-workout/workout-request', async (req, res, next) => {
  let userWorkoutId = req.session.workoutRequests[0];
  let userThatSendWorkoutRequestId = req.session.userThatSendWorkoutRequestId;
  let loggedInUserId = req.session.userInfo._id;

  const { workoutRequestAction } = req.body;
  if (workoutRequestAction === 'decline') {
      UserModel.findByIdAndUpdate(loggedInUserId, { $pull: { workoutRequests: userWorkoutId }})
          .then(() => {
              res.redirect('/myworkouts');
          }).catch(() => {
              res.redirect('/myworkouts');
          });    
  }
  if (workoutRequestAction === 'accept') {
      let userWorkout = req.session.userWorkoutSend;
      let copyUserWorkout = copyUserWorkoutDocumentSwapFriendAndOwner(userWorkout, loggedInUserId, userThatSendWorkoutRequestId);
      try {
        await UserModel.findByIdAndUpdate(loggedInUserId, { $pull: { workoutRequests: userWorkoutId }}); 
        await UserWorkoutModel.findByIdAndUpdate(userWorkoutId, { friend: loggedInUserId });
        await UserWorkoutModel.create(copyUserWorkout);
        res.redirect('/myworkouts');
      }
      catch(err) {
          res.redirect('/myworkouts');
      }
  }
})


module.exports = router;
