//Requires
const router = require("express").Router();
const UserModel = require("../models/User.model");
const UserWorkoutModel = require("../models/UserWorkout.model");
const checkLoggedIn = require("../middlewares/loggedInMiddleware");
const bcrypt = require("bcryptjs");
const navBarClasses = require('../data/navbarClasses');

//Get to account
router.get("/profile", checkLoggedIn, (req, res, next) => {
  // get _id from the session
  // get user from DB findById
  // in then() render with user got from findById
  const { _id } = req.session.userInfo;
  UserModel.findById(_id)
    .then((user) => {
      res.render("userprofile.hbs", { currentUser: user, navBarClasses });
    })
    .catch((err) => {
      next(err);
    });
});

// Edit username
router.get("/profile/:id/edit/username", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  UserModel.findById(_id)
    .then((user) => {
      res.render("profile/editusername.hbs", { currentUser: user, navBarClasses });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/profile/:id/edit/username", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  const { username } = req.body;
  UserModel.findByIdAndUpdate(_id, { username }, { new: false })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      next(err);
      res.render("profile/editusername.hbs", {
        currentUser: req.session.userInfo,
      });
    });
});

// Edit email
router.get("/profile/:id/edit/email", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  UserModel.findById(_id)
    .then((user) => {
      res.render("profile/editemail.hbs", { currentUser: user });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/profile/:id/edit/email", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  const { email } = req.body;
  UserModel.findByIdAndUpdate(_id, { email }, { new: false })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      next(err);
      res.render("profile/editemail.hbs", {
        currentUser: req.session.userInfo,
      });
    });
});

// Edit password
router.get("/profile/:id/edit/password", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  UserModel.findById(_id)
    .then((user) => {
      res.render("profile/editpassword.hbs", { currentUser: user });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/profile/:id/edit/password", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  const { password } = req.body;

  let checkPwd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (!checkPwd.test(password)) {
    res.render("profile/editpassword.hbs", {
      msg: "Password must have : at least one number, at least one special character, between 6 and 14 characters",
      currentUser: req.session.userInfo,
    });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  UserModel.findByIdAndUpdate(_id, { password: hash }, { new: false })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      next(err);
      res.render("profile/editpassword.hbs", {
        currentUser: user,
      });
    });
});

// Edit birthday
router.get("/profile/:id/edit/birthday", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  UserModel.findById(_id)
    .then((user) => {
      res.render("profile/editbirthday.hbs", { currentUser: user });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/profile/:id/edit/birthday", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  const { birthday } = req.body;
  UserModel.findByIdAndUpdate(_id, { birthday }, { new: false })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      next(err);
      res.render("profile/editemail.hbs", {
        currentUser: req.session.userInfo,
      });
    });
});

//Edit trainername
router.get("/profile/:id/edit/trainername", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  UserModel.findById(_id)
    .then((user) => {
      res.render("profile/edittrainername.hbs", { currentUser: user });
    })
    .catch((err) => {
      next(err);
    });
});

router.post(
  "/profile/:id/edit/trainername",
  checkLoggedIn,
  (req, res, next) => {
    const { _id } = req.session.userInfo;
    const { trainername } = req.body;
    UserModel.findByIdAndUpdate(_id, { trainername }, { new: false })
      .then(() => {
        res.redirect("/profile");
      })
      .catch((err) => {
        next(err);
        res.render("profile/edittrainername.hbs", {
          currentUser: req.session.userInfo,
        });
      });
  }
);

//Edit goals
router.get("/profile/:id/edit/goals", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  UserModel.findById(_id)
    .then((user) => {
      res.render("profile/editgoals.hbs", { currentUser: user });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/profile/:id/edit/goals", (req, res, next) => {
  const { _id } = req.session.userInfo;
  const { goals } = req.body;
  UserModel.findByIdAndUpdate(_id, { goals }, { new: false })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      next(err);
      res.render("profile/editgoals.hbs", {
        currentUser: req.session.userInfo,
      });
    });
});

//Edit athleteType
router.get("/profile/:id/edit/athletetype", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  UserModel.findById(_id)
    .then((user) => {
      res.render("profile/editathletetype.hbs", { currentUser: user });
    })
    .catch((err) => {
      next(err);
    });
});

router.post(
  "/profile/:id/edit/athletetype",
  checkLoggedIn,
  (req, res, next) => {
    const { _id } = req.session.userInfo;
    const { athleteType } = req.body;
    UserModel.findByIdAndUpdate(_id, { athleteType }, { new: false })
      .then(() => {
        res.redirect("/profile");
      })
      .catch((err) => {
        next(err);
        res.render("profile/editathletetype.hbs", {
          currenUser: req.session.userInfo,
        });
      });
  }
);

// Edit body
router.get("/profile/:id/edit/body", checkLoggedIn, (req, res, next) => {
  const { _id } = req.session.userInfo;
  console.log(req.session.userInfo);
  console.log(_id);
  UserModel.findById(_id)
    .then((user) => {
      res.render("profile/editbody.hbs", {
        currentUser: user,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/profile/:id/edit/body", checkLoggedIn, (req, res, next) => {
  console.log(req.body);
  const { _id } = req.session.userInfo;
  const { weight, height } = req.body;
  UserModel.findByIdAndUpdate(_id, { weight, height }, { new: false })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      next(err);
      res.render("profile/editbody.hbs", {
        currentUser: req.session.userInfo,
      });
    });
});

module.exports = router;
