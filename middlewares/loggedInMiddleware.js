// Middlewares to check if the user is logged in

const checkLoggedIn = (req, res, next) => {
  if (req.session.isUserLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

const mainPageLoginCheck = (req, res, next) => {
  if (req.session.isUserLoggedIn) {
    res.redirect("/myworkouts")
  } else {
    next();
  }
};

module.exports = {
  checkLoggedIn,
  mainPageLoginCheck
}