const router = require("express").Router();
const ExerciseModel = require('../models/Exercise.model');
const WorkoutModel = require('../models/Workout.model');
const { equipments, muscles } = require('../data/workoutData');
const {
    saveWorkoutDataInTheSession,
    turnSessionDataIntoWorkoutObject,
    resetSessionWorkoutData, 
    createIsCreatingWorkout, 
    createWorkoutObject,
    createNewExerciseObject,
    createNewExerciseToAddToSession
} = require('./library.helper')

// createIsCreatingWorkout will later be removed when we create this variable on login
router.get("/library/create-workout", createIsCreatingWorkout, resetSessionWorkoutData, (req, res, next) => {
    // const { exerciseNames } = req.session.workout;

    let workoutObj = turnSessionDataIntoWorkoutObject(req);

    res.render("./library/create-workout.hbs", {workoutObj});
});

router.post('/library/create-workout', (req, res, next) => {
    req.session.isCreatingWorkout = true;

    // This post request handles can be done from 3 different buttons
    // The create workout, create exercise and search exercise button
    // Because the user can possibly come back to the my workouts page, the data need to be stored in the session
    // This is done by the function below
    saveWorkoutDataInTheSession(req);

    // After that the post request is handled based on the type of button click
    if (req.body.button === 'create-workout') {
        let newWorkout = createWorkoutObject(req.session.workout);

        console.log(newWorkout)

        WorkoutModel.create(newWorkout)
            .then(() => {
                req.session.isCreatingWorkout = false;
                res.send('Redirect to My Workouts');
            }).catch((err) => {
                console.log("Something went wrong while creating a new workout", err)
                res.redirect('/library/create-workout')
            });
    }
    else if (req.body.button === 'search-for-exercise') {
        // Store the searchword, this will later be used to search for the exercises
        req.session.exerciseSearchWord = req.body.findExercise;
        res.redirect('/library/create-workout/exercise-pop-up')
    }
    else {
        res.redirect('/library/create-exercise')
    }
})

router.get("/library/create-exercise", (req, res, next) => {
    res.render("./library/create-exercise.hbs", {muscles, equipments});
})

router.post('/library/create-exercise', (req, res, next) => {
    
    let newExerciseForDatabase = createNewExerciseObject(req.body, muscles, equipments)

    ExerciseModel.create(newExerciseForDatabase)
        .then((exerciseData) => {
            // Add new created exercise to session
            req.session.workout.exerciseIds.push(exerciseData._id);
            req.session.workout.exerciseNames.push(exerciseData.name);
            let newExercise = createNewExerciseToAddToSession();
            req.session.workout.exercises.push(newExercise);

            res.redirect('/library/create-workout')
        }).catch((err) => {
            console.log('Something went wrong while creating a new exericse', err)
            res.redirect('/library/create-workout')
        });
})

router.get('/library/create-workout/exercise-pop-up', (req, res, next) => {
    const { exerciseSearchWord } = req.session;
    ExerciseModel.find({ "name": { "$regex": exerciseSearchWord, "$options": "i" }})
        .then((exerciseData) => {
            res.render('library/exercise-pop-up.hbs', {exerciseData})
        }).catch((err) => {
            console.log('Something went wrong while searching for exercises', err)
            // Display error message if no data is present.
            res.render('library/exercise-pop-up.hbs', {exerciseData})
        });
    
    // If nothing is found --> display create exercise button
})

router.post('/library/create-workout/exercise-pop-up', (req, res, next) => {
    const { exerciseId }  = req.body;
    ExerciseModel.findById(exerciseId)
        .then((singleExercise) => {
            req.session.workout.exerciseIds.push(singleExercise._id);
            req.session.workout.exerciseNames.push(singleExercise.name);
            req.session.workout.exercises.push(createNewExerciseToAddToSession());
            res.redirect('/library/create-workout')
        }).catch((err) => {
            console.log('Something went wrong while searching for a single exercise', err)
        });
})

module.exports = router;
