//Requires
const router = require("express").Router();
const UserWorkoutModel = require("../models/UserWorkout.model");
const checkLoggedIn = require("../middlewares/loggedInMiddleware");

//
changeScheduled = (id, scheduled, res) => {
  UserWorkoutModel.updateOne({ _id: id }, { scheduled: scheduled })
    .then((workout) => {
      res.redirect("/myworkouts");
    })
    .catch((err) => {
      console.log(err);
    });
};

//Get to main page : grab all workouts created by the user
router.get("/myworkouts", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  UserWorkoutModel.find({ userId: _id })
    .then((workouts) => {
      console.log("IN MYWORKOUTS");
      console.log(workouts);
      res.render("mainpage.hbs", {
        currentWorkouts: workouts,
        currentUser: req.session.userInfo,
      });
    })
    .catch((err) => {
      err;
    });
});

router.get("/myworkouts/:id/done", checkLoggedIn, (req, res, next) => {
  const id = req.params.id;
  changeScheduled(id, false, res);
});

router.get("/myworkouts/:id/scheduled", checkLoggedIn, (req, res, next) => {
  const id = req.params.id;
  changeScheduled(id, true, res);
});

module.exports = router;
