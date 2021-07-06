//Requires
const router = require("express").Router();
const UserModel = require("../models/User.model");
const UserWorkoutModel = require("../models/UserWorkout.model");
const checkLoggedIn = require("../middlewares/loggedInMiddleware");

//Get to main page
router.get("/myworkouts/", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  UserWorkoutModel.findById(_id)
    .then((user) => {
      res.render("mainpage.hbs", { currentUser: user });
    })
    .catch((err) => {
      err;
    });
});
