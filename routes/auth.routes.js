//Requires
const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

// SIGN UP ROUTES

// /signup
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

  let checkPwd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (!checkPwd.test(password)) {
    res.render("auth/signup.hbs", {
      msg: "Password must have : at least one number, at least one special character, between 6 and 14 characters",
    });
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  UserModel.create({ username, email, password: hash })
    .then(() => {
      // email is the key that identifies the user, it is stored as well inside the localStorage of the user to allows him to go through the signup flow
      req.app.locals.currentUser = { email: email };
      res.redirect("/signup/trainer-name");
    })
    .catch((err) => {
      next(err);
    });

  // At this time, data (username, email, password) are stored in the DB

  //The following data are stored locally, inside the session
});

// /signup/trainer-name
router.get("/signup/trainer-name", (req, res, next) => {
  res.render("auth/signuptrainer.hbs", {
    currentUser: req.app.locals.currentUser,
  });
});

router.post("/signup/trainer-name", (req, res, next) => {
  let currentUser = req.app.locals.currentUser;

  const { trainername } = req.body;
  if (!trainername) {
    res.render("auth/signuptrainer.hbs", { msg: "Please enter the field" });
    return;
  }

  UserModel.updateOne({ email: currentUser.email }, { trainername })
    .then(() => {
      req.app.locals.currentUser.trainername = trainername;
      res.redirect("/signup/athlete");
    })
    .catch((err) => {
      next(err);
    });
});

// /signup/athlete
router.get("/signup/athlete", (req, res, next) => {
  res.render("auth/signupathlete.hbs", {
    currentUser: req.app.locals.currentUser,
  });
});

router.post("/signup/athlete", (req, res, next) => {
  let currentUser = req.app.locals.currentUser;

  const { athleteType } = req.body;
  if (!athleteType) {
    res.render("auth/signupathlete.hbs", { msg: "Please enter the field" });
  }

  UserModel.updateOne({ email: currentUser.email }, { athleteType })
    .then(() => {
      req.app.locals.currentUser.athleteType = athleteType;
      res.redirect("/signup/body");
    })
    .catch((err) => {
      next(err);
    });
});

// /signup/body
router.get("/signup/body", (req, res, next) => {
  res.render("auth/signupbody.hbs", {
    currentUser: req.app.locals.currentUser,
  });
});

router.post("/signup/body", (req, res, next) => {
  let currentUser = req.app.locals.currentUser;

  const { height, weight } = req.body;
  if (!height || !weight) {
    res.render("auth/signupbody.hbs", { msg: "Please enter the field" });
  }

  UserModel.updateOne({ email: currentUser.email }, { height, weight })
    .then(() => {
      req.app.locals.currentUser.height = height;
      req.app.locals.currentUser.weight = weight;
      res.redirect("/signup/birthday");
    })
    .catch((err) => {
      next(err);
    });
});

// /signup/birthday
router.get("/signup/birthday", (req, res, next) => {
  res.render("auth/signupbirthday.hbs", {
    currentUser: req.app.locals.currentUser,
  });
});

router.post("/signup/birthday", (req, res, next) => {
  let currentUser = req.app.locals.currentUser;
  const { birthday } = req.body;

  if (!birthday) {
    res.render("auth/signupbirthday.hbs", { msg: "Please enter the field" });
  }

  UserModel.updateOne({ email: currentUser.email }, { birthday })
    .then(() => {
      req.app.locals.currentUser.birthday = birthday;
      res.redirect("/signup/goals");
    })
    .catch((err) => {
      next(err);
    });
});

// /signup/goals

router.get("/signup/goals", (req, res, next) => {
  res.render("auth/signupgoals.hbs", {
    currentUser: req.app.locals.currentUser,
  });
});

router.post("/signup/goals", (req, res, next) => {
  let currentUser = req.app.locals.currentUser;
  const { goals } = req.body;
  if (!goals) {
    res.render("auth/signupgoals.hbs", {
      msg: "Please select at least one box",
    });
  }

  UserModel.updateOne({ email: currentUser.email }, { goals })
    .then(() => {
      req.app.locals.currentUser.goals = goals;
      res.redirect("/signup/profile-created");
    })
    .catch((err) => {
      next(err);
    });
});

// // /signup/journey
// router.get("/signup/journey", (req, res, next) => {
//   res.render("auth/signupjourney.hbs");
// });
// router.post("/signup/journey", (req, res, next) => {
//   res.redirect("/signup/profile-created");
// });

// /signup/profilecreated
router.get("/signup/profile-created", (req, res, next) => {
  res.render("auth/signupprofile-created.hbs");
});

router.post("/signup/profile-created", (req, res, next) => {
  res.redirect("/myworkouts/:user");
});

// SIGN IN ROUTES

//

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
