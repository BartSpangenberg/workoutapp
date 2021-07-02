const router = require("express").Router();

router.get("/library/create-workout", (req, res, next) => {
  res.render("./library/create-workout.hbs");
});

module.exports = router;
