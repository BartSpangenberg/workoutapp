//Requires
const router = require("express").Router();
const UserModel = require("../models/User.model");
const UserWorkoutModel = require("../models/UserWorkout.model");
const checkLoggedIn = require("../middlewares/loggedInMiddleware");

//Get to main page
<<<<<<< HEAD
router.get("/myworkouts", checkLoggedin, (req, res, next) => {
=======
router.get("/myworkouts/", checkLoggedIn, (req, res, next) => {
>>>>>>> a8ce32cacc58953127c65aef4ebf14fe136b3e98
  const { _id } = req.session.userInfo;
  UserWorkoutModel.findById(_id)
    .then((user) => {
      res.render("mainpage.hbs", { currentUser: user });
    })
    .catch((err) => {
      err;
    });
});

module.exports = router;