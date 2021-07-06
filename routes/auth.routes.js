//Requires
const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

//-------------------------------
//        SIGN UP ROUTES
//-------------------------------

// /signup
router.get("/signup", (req, res, next) => {
  // with this condition : when the user closes the browser and open it again to continue the signup process, he will be redirected to the page he left
  if (req.session.currentUser) {
    res.redirect(req.session.currentUser.currentView);
  } else {
    res.render("auth/signup.hbs");
  }
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
      req.session.currentUser = { email: email };
      //the currentView of the user is stored in the session
      req.session.currentUser.currentView = "/signup/trainer-name";
      res.redirect("/signup/trainer-name");
    })
    .catch((err) => {
      next(err);
    });

  // At this time, data (username, email, password) are stored in the DB

  //The following data are stored locally
});

// /signup/trainer-name
router.get("/signup/trainer-name", (req, res, next) => {
  res.render("auth/signuptrainer.hbs", {
    currentUser: req.session.currentUser,
  });
});

router.post("/signup/trainer-name", (req, res, next) => {
  let currentUser = req.session.currentUser;

  const { trainername } = req.body;
  if (!trainername) {
    res.render("auth/signuptrainer.hbs", { msg: "Please enter the field" });
    return;
  }

  UserModel.updateOne({ email: currentUser.email }, { trainername })
    .then(() => {
      req.session.currentUser.trainername = trainername;
      req.session.currentUser.currentView = "/signup/athlete";
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
  let currentUser = req.session.currentUser;

  const { athleteType } = req.body;
  if (!athleteType) {
    res.render("auth/signupathlete.hbs", { msg: "Please enter the field" });
  }

  UserModel.updateOne({ email: currentUser.email }, { athleteType })
    .then(() => {
      req.session.currentUser.athleteType = athleteType;
      req.session.currentUser.currentView = "/signup/body";
      res.redirect("/signup/body");
    })
    .catch((err) => {
      next(err);
    });
});

// /signup/body
router.get("/signup/body", (req, res, next) => {
  res.render("auth/signupbody.hbs", {
    currentUser: req.session.currentUser,
  });
});

router.post("/signup/body", (req, res, next) => {
  let currentUser = req.session.currentUser;

  const { height, weight } = req.body;
  if (!height || !weight) {
    res.render("auth/signupbody.hbs", { msg: "Please enter the field" });
  }

  UserModel.updateOne({ email: currentUser.email }, { height, weight })
    .then(() => {
      req.session.currentUser.height = height;
      req.session.currentUser.weight = weight;
      req.session.currentUser.currentView = "/signup/birthday";
      res.redirect("/signup/birthday");
    })
    .catch((err) => {
      next(err);
    });
});

// /signup/birthday
router.get("/signup/birthday", (req, res, next) => {
  res.render("auth/signupbirthday.hbs", {
    currentUser: req.session.currentUser,
  });
});

router.post("/signup/birthday", (req, res, next) => {
  let currentUser = req.session.currentUser;
  const { birthday } = req.body;

  if (!birthday) {
    res.render("auth/signupbirthday.hbs", { msg: "Please enter the field" });
  }

  UserModel.updateOne({ email: currentUser.email }, { birthday })
    .then(() => {
      req.session.currentUser.birthday = birthday;
      req.session.currentUser.currentView = "/signup/goals";
      res.redirect("/signup/goals");
    })
    .catch((err) => {
      next(err);
    });
});

// /signup/goals

router.get("/signup/goals", (req, res, next) => {
  res.render("auth/signupgoals.hbs", {
    currentUser: req.session.currentUser,
  });
});

router.post("/signup/goals", (req, res, next) => {
  let currentUser = req.session.currentUser;
  const { goals } = req.body;
  if (!goals) {
    res.render("auth/signupgoals.hbs", {
      msg: "Please select at least one box",
    });
  }

  UserModel.updateOne({ email: currentUser.email }, { goals })
    .then(() => {
      req.session.currentUser.goals = goals;
      req.session.currentUser.currentView = "/signup/profile-created";
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

//-------------------------------
//        SIGN IN ROUTES
//-------------------------------

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render("auth/login.hbs", {
      errorLogin: "Please enter your email and password",
    });
    return;
  }

  UserModel.findOne({ email })
    .then((user) => {
      console.log(user);
      if (!user) {
        res.render("auth/login.hbs", { errorLogin: "Email is incorrect" });
      } else {
        bcrypt.compare(req.body.password, user.password).then((isMatching) => {
          if (isMatching) {
            req.session.userInfo = user;
            req.session.isUserLoggedIn = true;
            req.app.locals.isUserLoggedIn = req.session.isUserLoggedIn;
            res.redirect("/");
          } else {
            res.render("auth/login.hbs", {
              errorLogin: "Password is incorrect",
            });
          }
        });
      }
    })
    .catch((err) => {
      next(err);
    });
});

// ---------------
//  SIGNOUT ROUTE
// ---------------

router.get("/login", (req, res, next) => {
  req.app.locals.isUserLoggedIn = false;
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
