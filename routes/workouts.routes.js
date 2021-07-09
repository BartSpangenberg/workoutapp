const router = require("express").Router();
const UserWorkoutModel = require("../models/UserWorkout.model");
const { checkLoggedIn } = require("../middlewares/loggedInMiddleware");
const { checkFriendRequests, checkWorkoutRequests } = require("../middlewares/friendMiddleware");
const navBarClasses = require('../data/navbarClasses');

// Might need to change
const { convertWorkoutDataIntoArrayOfTags } = require('./library.helper');

//Function with parameters : id (to grab all the userWorkouts), scheduled
// used to make the update from false to true
changeScheduled = (id, scheduled, res) => {
  UserWorkoutModel.updateOne({ _id: id }, { scheduled: scheduled })
    .then((workout) => {
      res.redirect("/myworkouts");
    })
    .catch((err) => {
      console.log(err);
    });
};

//Get to main page : find all workouts created by the user
router.get("/myworkouts", checkLoggedIn, checkFriendRequests, checkWorkoutRequests, (req, res, next) => {
  const { _id } = req.session.userInfo;
  UserWorkoutModel.find({ userId: _id }).populate('friend')
    .then((workouts) => {
      res.render("mainpage.hbs", {
        currentWorkouts: workouts,
        currentUser: req.session.userInfo,
        navBarClasses
      });
    })
    .catch((err) => {
      next(err);
    });
});

//Route to change the status of schedule : done => scheduled is false
router.get("/myworkouts/:id/done", checkLoggedIn, (req, res, next) => {
  const id = req.params.id;
  changeScheduled(id, false, res);
});

//Route to change the status of schedule : scheduled => scheduled is true
router.get("/myworkouts/:id/scheduled", checkLoggedIn, (req, res, next) => {
  const id = req.params.id;
  changeScheduled(id, true, res);
});

// WORKIN HERE
router.get('/myworkouts/workout-information/:id',  checkLoggedIn, (req, res, next) => {
  const { id } = req.params;
  UserWorkoutModel.findById(id)
      .populate('exercises.exerciseId')
      .then((workoutData) => {
          const tags = convertWorkoutDataIntoArrayOfTags(workoutData);
          res.render('myworkouts/workout-information.hbs', {workoutData, tags, navBarClasses})
      }).catch((err) => {
          console.log("Something went wrong while searching for the workout", err);
      });
})

module.exports = router;
