const e = require("express");

const router = require("express").Router();

let types = ["Bodyweight", "Gym", "Outdoor", "Athlete", "Mobility", "Endurance"]; 
let levels = ["Lannister / Targaryan", "Beginner", "Advanced", "Pro", "Stark"];
let goalsArr = ["Get summer fit", "Run a marathon", "Become more athletic", "Improve endurance", "Lose weight", "Build muscle"];
let intensities = ["Low", "Medium", "High"];
let unitTypes = ["Reps", "Minutes", "Meters", "Km"];

// createIsCreatingWorkout will later be removed when we create this variable on login
router.get("/library/create-workout", createIsCreatingWorkout, resetSessionWorkoutData, (req, res, next) => {
    // Renders the workout data from the session into the create workout page
    let workoutObj = turnSessionDataIntoWorkoutObject(req);
    // console.log('WORKOUT OBJECT', workoutObj)
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
    const {name, description, duration, type, level, goals, intensity, reps, unitType, restBetweenExercises, sets, restBetweenSets} = req.body;

    req.session.workout = {};
    req.session.workout.name = name;
    req.session.workout.description = description;
    
    req.session.workout.type = {};
    req.session.workout.type.Selected = type;
    req.session.workout.type.NotSelected = createArrayOfNotSelectedItems(types, req.session.workout.type.Selected);
    
    req.session.workout.duration = duration;

    req.session.workout.level = {};
    req.session.workout.level.Selected = level;
    req.session.workout.level.NotSelected = createArrayOfNotSelectedItems(levels, req.session.workout.level.Selected);

    req.session.workout.goals = {};
    req.session.workout.goals.Selected = goals;
    req.session.workout.goals.NotSelected = createArrayOfNotSelectedItems(goalsArr, req.session.workout.goals.Selected);

    req.session.workout.intensity = {};
    req.session.workout.intensity.Selected = intensity;
    req.session.workout.intensity.NotSelected = createArrayOfNotSelectedItems(intensities, req.session.workout.intensity.Selected);

    req.session.workout.exercises = turnExerciseArraysIntoOneArrayOfExerciseObjects(reps, unitType, restBetweenExercises, sets, restBetweenSets);
}

function turnExerciseArraysIntoOneArrayOfExerciseObjects(reps, unitType, restBetweenExercises, sets, restBetweenSets) {
    let exercises = [];
    if (typeof reps === 'string') {
        let newExercise = {};
        newExercise = {
            reps, 
            sets,
            restBetweenSets,
            restBetweenExercises,
            unitTypes: {
                Selected: unitType,
                NotSelected: createArrayOfNotSelectedItems(unitTypes, unitType)
            }
        }
        exercises.push(newExercise);
    }
    else {
        for (let i = 0; i < n; i++) {
            let newExercise = {
                reps: reps[i],
                unitType: unitType[i],
                sets: sets[i],
                restBetweenSets: restBetweenSets[i],
                restBetweenExercises: restBetweenExercises[i],
                unitTypes: {
                    Selected: unitType[i],
                    NotSelected: createArrayOfNotSelectedItems(unitTypes, unitType[i])
                }
            }
            exercises.push(newExercise);
        }   
    }
    return exercises;
}

function turnSessionDataIntoWorkoutObject(req) {
    let workoutObj = {};
    workoutObj.name = req.session.workout.name;
    workoutObj.description = req.session.workout.description;
    workoutObj.duration = req.session.workout.duration;

    workoutObj.type = {};
    workoutObj.type.Selected = req.session.workout.type.Selected;
    workoutObj.type.NotSelected = req.session.workout.type.NotSelected;

    workoutObj.level = {};
    workoutObj.level.Selected = req.session.workout.level.Selected;
    workoutObj.level.NotSelected = req.session.workout.level.NotSelected;
    
    workoutObj.goals = {};
    workoutObj.goals.Selected = req.session.workout.goals.Selected;
    workoutObj.goals.NotSelected = req.session.workout.goals.NotSelected;

    workoutObj.intensity = {};
    workoutObj.intensity.Selected = req.session.workout.intensity.Selected;
    workoutObj.intensity.NotSelected = req.session.workout.intensity.NotSelected;

    workoutObj.exercises = req.session.workout.exercises;

    return workoutObj;
}

function createArrayOfNotSelectedItems(array, selectedItem) {
    const cloneArr = JSON.parse(JSON.stringify(array))
    let indexSelectedItem = cloneArr.indexOf(selectedItem);
    cloneArr.splice(indexSelectedItem, 1);
    return cloneArr;
}

function resetSessionWorkoutData(req, res, next) {
    if (!req.session.isCreatingWorkout) {
        req.session.workout = {};
        req.session.workout.name = '';
        req.session.workout.description = '';
        req.session.workout.duration = 10;

        req.session.workout.type = {};
        req.session.workout.type.Selected = types[0];
        req.session.workout.type.NotSelected = createArrayOfNotSelectedItems(types, types[0]);

        req.session.workout.level = {};
        req.session.workout.level.Selected = levels[0];
        req.session.workout.level.NotSelected = createArrayOfNotSelectedItems(levels, levels[0]);

        req.session.workout.goals = {};
        req.session.workout.goals.Selected = goalsArr[0];
        req.session.workout.goals.NotSelected = createArrayOfNotSelectedItems(goalsArr, goalsArr[0]);

        req.session.workout.intensity = {};
        req.session.workout.intensity.Selected = intensities[0];
        req.session.workout.intensity.NotSelected = createArrayOfNotSelectedItems(intensities, intensities[0]);

        let newExercise = {
            reps: 10,
            sets: 1,
            restBetweenSets: 60,
            restBetweenExercises: 30,
            unitTypes: {
                Selected: 'Reps',
                NotSelected: ['Minutes', 'Meter', 'Km']
            }
        };
        req.session.workout.exercises = [newExercise];
    }
    next();
}

function createIsCreatingWorkout(req, res, next) {
    // Temporary variable which needs to be created on cookie when the user logs in
    if (!('isCreatingWorkout' in req.session)) {
        req.session.isCreatingWorkout = false;
    }
    next();
}

function addExerciseToTheSession(req, res, next) {

    
    // push exercise name, and id to the workout session
        // Workout session needs to have name aswell in order to render the exercise data (maybe not neccessary if we load in the data dynamically)
}

module.exports = router;
