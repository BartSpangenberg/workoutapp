const router = require("express").Router();

router.get("/library/create-workout", (req, res, next) => {
  res.render("./library/create-workout.hbs");
});

router.get("/library/create-exercise", (req, res, next) => {
    res.render("./library/create-exercise.hbs");
})

module.exports = router;
