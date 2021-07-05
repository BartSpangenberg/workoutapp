const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  // currentUser is the user, and contains the view where the user left
  let currentUser = req.session.currentUser;
  let isUserLoggedIn = req.app.locals.isUserLoggedIn;

  if (
    currentUser &&
    isUserLoggedIn &&
    currentUser.currentView !== "/signup/profile-created"
  ) {
    res.redirect(currentUser.currentView);
  } else {
    res.render("index");
  }
});

module.exports = router;
