// Middlewares to check if the user is logged in

const checkLoggedIn = (req, res, next) => {
  if (req.session.isUserLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports = checkLoggedIn;
