// Middlewares to check if the user is logged in

const checkLoggedIn = (req, res, next) => {
  console.log(req.session.isUserLoggedIn);
  if (req.session.isUserLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports = checkLoggedIn;
