const router = require("express").Router();
const { mainPageLoginCheck } = require("../middlewares/loggedInMiddleware");


/* GET home page */
router.get("/", mainPageLoginCheck, (req, res, next) => {
  let currentUser = req.session.currentUser; // currentUser is the user, and contains the view where the user left
  let isUserLoggedIn = req.app.locals.isUserLoggedIn;

  // if currentUser exists and if he is loggedin and if his last view is not the the last screen of the userflow, he will be redirected to the last view
  //else, he will be redirected to the index
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
