//Requires
const router = require("express").Router();
const UserModel = require("../models/User.model");
const UserWorkoutModel = require("../models/UserWorkout.model");
const checkLoggedIn = require("../middlewares/loggedInMiddleware");

//Get to main page
<<<<<<< HEAD
router.get("/myworkouts/", checkLoggedIn, (req, res, next) => {
=======
router.get("/myworkouts", checkLoggedin, (req, res, next) => {
>>>>>>> 9328a4fe7279b3e63ced6b139e1c0cc09a47fb30
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