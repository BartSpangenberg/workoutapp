//Requires
const router = require("express").Router();
const UserModel = require("../models/User.model");
const UserWorkoutModel = require("../models/UserWorkout.model");

// check if user is logged In

const checkLoggedin = (req, res, next) => {
  console.log(req.session.isUserLoggedIn);
  if (req.session.isUserLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

//Get to main page
router.get("/myworkouts", checkLoggedin, (req, res, next) => {
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