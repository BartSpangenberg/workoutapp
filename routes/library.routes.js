const router = require("express").Router();
const ExerciseModel = require('../models/Exercise.model');
const WorkoutModel = require('../models/Workout.model');
const { types, levels, goalsArr, intensities, unitTypes, equipments, muscles } = require('../data/workoutData');

// createIsCreatingWorkout will later be removed when we create this variable on login
router.get("/library/create-workout", createIsCreatingWorkout, resetSessionWorkoutData, (req, res, next) => {
    const { exerciseNames } = req.session.workout;

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
        const {name, description, duration, type, level, goals, intensity, exercises, exerciseIds} = req.session.workout;
        let newWorkout = {
            name,
            description,
            duration: +duration,
            type: extractWorkoutDataFromSession(type),
            athleteLevel: extractWorkoutDataFromSession(level),
            goals: [extractWorkoutDataFromSession(goals)],
            intensity: extractWorkoutDataFromSession(intensity),
            exercises: addIdsToExercises(exercises, exerciseIds)
        }
        console.log(newWorkout)

        WorkoutModel.create(newWorkout)
            .then((createdWorkout) => {
                req.session.isCreatingWorkout = false;
                res.send('Redirect to My Workouts');


            }).catch((err) => {
                console.log("Something went wrong while creating a new workout", err)
                res.redirect('/library/create-workout')
            });
    }
    else if (req.body.button === 'search-for-exercise') {
        const { findExercise: searchWord } = req.body
        req.session.exerciseSearchWord = searchWord;
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
    const {name , description} = req.body;
    let muscleData = convertCheckboxData(req.body, muscles);
    let equipmentData = convertCheckboxData(req.body, equipments);

    let newExerciseForDatabase = {
        name,
        description,
        equipments: equipmentData.length > 0 ? equipmentData : equipments[0],
        muscles: muscleData.length > 0 ? muscleData : muscles[0]
    } 

    ExerciseModel.create(newExerciseForDatabase)
        .then((exerciseData) => {
            req.session.workout.exerciseIds.push(exerciseData._id);
            req.session.workout.exerciseNames.push(exerciseData.name);
            let newExercise = {
                reps: 10,
                sets: 1,
                restBetweenSets: 60,
                restBetweenExercises: 30,
                unitTypes: {
                    Selected: 'Reps',
                    NotSelected: ['Minutes', 'Meter', 'Km']
                }
            }
            req.session.workout.exercises.push(newExercise)

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

            req.session.workout.exercises.push({
                reps: 10,
                sets: 1,
                restBetweenSets: 60,
                restBetweenExercises: 30,
                unitTypes: {
                    Selected: 'Reps',
                    NotSelected: ['Minutes', 'Meter', 'Km']
                }
            })
            res.redirect('/library/create-workout')
        }).catch((err) => {
            console.log('Something went wrong while searching for a single exercise', err)
        });
})

function saveWorkoutDataInTheSession(req) { 
    const {name, description, duration, type, level, goals, intensity, reps, unitType, restBetweenExercises, sets, restBetweenSets, exerciseName, exerciseId} = req.body;
    let updatedWorkout = {
        name,
        description,
        duration,
        type: {
            Selected: type,
            NotSelected: createArrayOfNotSelectedItems(types, type)
        },
        level: {
            Selected: level,
            NotSelected: createArrayOfNotSelectedItems(levels, level)
        },
        goals: {
            Selected: goals,
            NotSelected: createArrayOfNotSelectedItems(goalsArr, goals)
        },
        intensity: {
            Selected: intensity,
            NotSelected: createArrayOfNotSelectedItems(intensities, intensity)
        },
        exercises: !reps ? [] : turnExerciseArraysIntoOneArrayOfExerciseObjects(reps, unitType, restBetweenExercises, sets, restBetweenSets, exerciseName, exerciseId),
        exerciseIds: req.session.workout.exerciseIds,
        exerciseNames: req.session.workout.exerciseNames
    }	
    
    req.session.workout = updatedWorkout
}

function turnExerciseArraysIntoOneArrayOfExerciseObjects(reps, unitType, restBetweenExercises, sets, restBetweenSets, exerciseName, exerciseId) {
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
        for (let i = 0; i < reps.length; i++) {
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
    let { name, description, duration, type, level, goals, intensity, exercises, exerciseNames } = req.session.workout
    exercises = addExerciseNamesToWorkoutObj(exercises, exerciseNames);
    const workoutObj = { name, description, duration, type, level, goals, intensity, exercises };
    return workoutObj
}

function createArrayOfNotSelectedItems(array, selectedItem) {
    const cloneArr = JSON.parse(JSON.stringify(array))
    let indexSelectedItem = cloneArr.indexOf(selectedItem);
    cloneArr.splice(indexSelectedItem, 1);
    return cloneArr;
}

function resetSessionWorkoutData(req, res, next) {
    if (!req.session.isCreatingWorkout) {
        req.session.workout = {
            name: '',
            description: '',
            duration: 10,
            type: {
                Selected: types[0],
                NotSelected: createArrayOfNotSelectedItems(types, types[0])
            },
            level: {
                Selected: levels[0],
                NotSelected: createArrayOfNotSelectedItems(levels, levels[0])
            },
            goals: {
                Selected: goalsArr[0],
                NotSelected: createArrayOfNotSelectedItems(goalsArr, goalsArr[0])
            },
            intensity: {
                Selected: intensities[0],
                NotSelected: createArrayOfNotSelectedItems(intensities, intensities[0])
            },
            exercises: [],
            exerciseIds: [],
            exerciseNames: []
        }

        // req.session.workout = {};


        // req.session.workout.exerciseIds = [];
        // req.session.workout.exerciseNames = [];
        // req.session.workout.name = '';
        // req.session.workout.description = '';
        // req.session.workout.duration = 10;

        // req.session.workout.type = {};
        // req.session.workout.type.Selected = types[0];
        // req.session.workout.type.NotSelected = createArrayOfNotSelectedItems(types, types[0]);

        // req.session.workout.level = {};
        // req.session.workout.level.Selected = levels[0];
        // req.session.workout.level.NotSelected = createArrayOfNotSelectedItems(levels, levels[0]);

        // req.session.workout.goals = {};
        // req.session.workout.goals.Selected = goalsArr[0];
        // req.session.workout.goals.NotSelected = createArrayOfNotSelectedItems(goalsArr, goalsArr[0]);

        // req.session.workout.intensity = {};
        // req.session.workout.intensity.Selected = intensities[0];
        // req.session.workout.intensity.NotSelected = createArrayOfNotSelectedItems(intensities, intensities[0]);

        // req.session.workout.exercises = [];
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

function convertCheckboxData(object, array) {
    let newArr = [];
    for (key in object) {
        array.forEach(el => {
            if(key === el) {
                newArr.push(key)
            }
        })
    }
    return newArr;
}

function extractWorkoutDataFromSession(object) {
    return object.Selected
}  

function addIdsToExercises(exercises, ids) {
    exercises.forEach((exercise, index) => {
        exercise.exerciseId = ids[index];
        exercise.unitType = exercise.unitTypes.Selected;
    })
    return exercises
}

function addExerciseNamesToWorkoutObj(exercises, exerciseNames) {
    for (let i = 0; i < exercises.length; i++) {
        exercises[i].exerciseName = exerciseNames[i];
    }
    return exercises
}

module.exports = router;
