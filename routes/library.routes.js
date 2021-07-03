const router = require("express").Router();

router.get("/library/create-workout", (req, res, next) => {
    // Renders the workout data from the session into the create workout page
    let workoutObj = turnSessionDataIntoWorkoutObject(req);
    res.render("./library/create-workout.hbs", {workoutObj});
});

router.post('/library/create-workout', (req, res, next) => {
    // This post request handles can be done from 3 different buttons
    // The create workout, create exercise and search exercise button
    // Because the user can possibly come back to the my workouts page, the data need to be stored in the session
    // This is done by the function below
    saveWorkoutDataInTheSession(req);

    // After that the post request is handled based on the type of button click
    if (req.body.button === 'create-workout') {
        res.send('Redirect to My Workouts');
    }
    else if (req.body.button === 'search-for-exercise') {
        res.redirect('/library/create-workout/exercise-pop-up')
    }
    else {
        res.redirect('/library/create-exercise')
    }

    // Save exercises in DB in workout to do
    // Clears the workout data from the session
    // Redirects to My workouts
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
    res.render('library/exercise-pop-up.hbs')
})

router.post('/library/exercise-search', (req, res, next) => {
    // saveWorkoutDataInTheSession()
    // redirect to /library/create-workout/exercise-pop-up
})

router.post('/library/create-workout/exercise-pop-up', (req, res, next) => {
    // Redirect to /library/create-workout
    // push exercise name, and id to the workout session
})

function saveWorkoutDataInTheSession(req) {
    req.session.workout = {};
    req.session.workout.name = req.body.name;
    req.session.workout.description = req.body.description;
    req.session.workout.type = req.body.type;
    req.session.workout.duration = req.body.duration;
    req.session.workout.level = req.body.level;
    req.session.workout.goals = req.body.goals;
    req.session.workout.intensity = req.body.intensity;
}

function turnSessionDataIntoWorkoutObject(req) {
    let workoutObj = {};
    workoutObj.name = req.session.workout.name;
    workoutObj.description = req.session.workout.description;
    workoutObj.type = req.session.workout.type;
    workoutObj.duration = req.session.workout.duration;
    workoutObj.level = req.session.workout.level;
    workoutObj.goals = req.session.workout.goals;
    workoutObj.intensity = req.session.workout.intensity;
    return workoutObj
}

function addExerciseToTheSession() {
    // push exercise name, and id to the workout session
        // Workout session needs to have name aswell in order to render the exercise data (maybe not neccessary if we load in the data dynamically)
}

module.exports = router;
