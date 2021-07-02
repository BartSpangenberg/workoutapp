//Requires
const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

//SIGN UP ROUTES
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.render("auth/signup.hbs", { msg: "Please enter all fields" });
    return;
  }

  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailReg.test(email)) {
    res.render("/auth/signup.hbs", {
      msg: "Please enter a valid email format",
    });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  let checkPwd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (!checkPwd.test(password)) {
    res.render("auth/signup.hbs", {
      msg: "Password must have : at least on number, at least one special character. between 6 and 14 characters",
    });
    return;
  }

  UserModel.create({ username, email, password: hash })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });

  //--------------
  // At this time, data (email and password) are stored in the DB
  //--------------

  //The following data are stored locally, inside the session
});

router.post("/signup/trainer-name", (req, res, next) => {
  const { trainername } = req.body;
});

router.post("/signup/athlete", (req, res, next) => {
  const { athleteType } = req.body;
});

router.post("/signup/body", (req, res, next) => {
  const { height, weight } = req.body;
});

router.post("/signup/birthday", (req, res, next) => {
  const { birthday } = req.body;
});

router.post("/signup/goals", (req, res, next) => {
  const { goals } = req.body;
});

router.post("/signup/journey", (req, res, next) => {
  const { trainer } = req.body;
});

router.post("/signup/profile-created", (req, res, next) => {
  const { trainer } = req.body;
});

// SIGN IN ROUTES

// SIGN OUT ROUTE
//---------------
//  SIGNOUT
//---------------

// router.get('/login', (req, res, next) => {
//     req.session.destroy()

//     // set global
//     req.app.locals.isLoggedIn = false;
//     res.redirect('/')
//  })

module.exports = router;
