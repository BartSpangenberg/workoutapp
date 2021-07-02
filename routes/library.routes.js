const router = require("express").Router();

router.get("/library/create-workout", (req, res, next) => {
    // Renders the workout data from the session into the create workout page
    res.render("./library/create-workout.hbs");
});

router.post('/library/create-workout', (req, res, next) => {
    // Save exercises in DB in workout to do
    // Clears the workout data from the session
    // Redirects to My workouts
})

// This route is an in-between-route, not an actual page. Uses 
router.post('/library/create-exercise-save-session', (req, res, next) => {
    // saveWorkoutDataInTheSession()
    // redirect to /library/create/exercise
})

router.get("/library/create-exercise", (req, res, next) => {
    res.render("./library/create-exercise.hbs");
})

router.post('/library/create-exercise', (req, res, next) => {
    // Create create new exercise in the database
    // addExerciseToTheSession()
    // Redirect to /library/create-workout
})

router.get('/library/create-workout/exercise-pop-up', (req, res, next) => {
    // Search for the regular expression given by the req.query
    // Dynamically render the workouts that are found by the query
    // If nothing is found --> display create exercise button
})

router.post('/library/exercise-search', (req, res, next) => {
    // saveWorkoutDataInTheSession()
    // redirect to /library/create-workout/exercise-pop-up
})

router.post('/library/create-workout/exercise-pop-up', (req, res, next) => {
    // Redirect to /library/create-workout
    // push exercise name, and id to the workout session
})

function saveWorkoutDataInTheSession() {

}

function addExerciseToTheSession() {
    // push exercise name, and id to the workout session
        // Workout session needs to have name aswell in order to render the exercise data (maybe not neccessary if we load in the data dynamically)
}

module.exports = router;
