const router = require("express").Router();
const ExerciseModel = require('../models/Exercise.model');
const WorkoutModel = require('../models/Workout.model');

let types = ["Bodyweight", "Gym", "Outdoor", "Athlete", "Mobility", "Endurance"]; 
let levels = ["Lannister / Targaryan", "Beginner", "Advanced", "Pro", "Stark"];
let goalsArr = ["Get summer fit", "Run a marathon", "Become more athletic", "Improve endurance", "Lose weight", "Build muscle"];
let intensities = ["Low", "Medium", "High"];
let unitTypes = ["Reps", "Minutes", "Meters", "Km"];
let equipments = ["None (bodyweight exercise)", "Barbell", "Dumbell",  "Kettlebell", "SwissBal", "Bench", "Gym mat", "Incline Bench", "Pull-up bar", "SZ-Bar"]
let muscles  = [`I haven't the faintest idea`,'Anterior deltoid','Biceps brachii','Bicpes femoris','Brachialis','Gastrocnemius','Gluteus maximus','Latissimus dorsi','Obliquus externus abdominis','Pectoralis major','Quadriceps femoris','Rectus abdominis','Serratus anterior','Soleus','Trapezius','Triceps brachii','Erector spinae','Gastrocnemius'];

// createIsCreatingWorkout will later be removed when we create this variable on login
router.get("/library/create-workout", createIsCreatingWorkout, resetSessionWorkoutData, (req, res, next) => {
    const { exerciseNames } = req.session.workout;
    // Renders the workout data from the session into the create workout page
    let workoutObj = turnSessionDataIntoWorkoutObject(req);
    // console.log('WORKOUT OBJECT', workoutObj)
    res.render("./library/create-workout.hbs", {workoutObj, exerciseNames});
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

    // Save exercises in DB in workout to do
    // Clears the workout data from the session
    // Redirects to My workouts
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
                // exerciseId: exerciseData._id,
                // exerciseName: exerciseData.name,
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
            // Create function that checks if array is empty
            res.render('library/exercise-pop-up.hbs', {exerciseData})
        });
    
    // If nothing is found --> display create exercise button
})

router.post('/library/create-workout/exercise-pop-up', (req, res, next) => {
    const { exerciseId }  = req.body;
    // const { exerciseIds }  = req.session.workout;
    // console.log(exerciseIds)
    // const exerciseId = exerciseIds[exerciseIds.length - 1];
    ExerciseModel.findById(exerciseId)
        .then((singleExercise) => {

            req.session.workout.exerciseIds.push(singleExercise._id);
            req.session.workout.exerciseNames.push(singleExercise.name);

            req.session.workout.exercises.push({
                // exerciseId: singleExercise._id,
                // exerciseName: singleExercise.name,
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
    // push exercise name, and id to the workout session
})

function saveWorkoutDataInTheSession(req) { 
    const {name, description, duration, type, level, goals, intensity, reps, unitType, restBetweenExercises, sets, restBetweenSets, exerciseName, exerciseId} = req.body;
    	
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
    
    if (req.session.workout.exercises.length !== 0) {
        req.session.workout.exercises = turnExerciseArraysIntoOneArrayOfExerciseObjects(reps, unitType, restBetweenExercises, sets, restBetweenSets, exerciseName, exerciseId);
    }
    else {
        req.session.workout.exercises = [];
    }
}

function turnExerciseArraysIntoOneArrayOfExerciseObjects(reps, unitType, restBetweenExercises, sets, restBetweenSets, exerciseName, exerciseId) {
    let exercises = [];
    if (typeof reps === 'string') {
        let newExercise = {};
        newExercise = {
            // exerciseId,
            // exerciseName,
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
                // exerciseId: exerciseId[i],
                // exerciseName: exerciseName[i],
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

    workoutObj.exercises = addExerciseNamesToWorkoutObj(req.session.workout.exercises, req.session.workout.exerciseNames);

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

        req.session.workout.exerciseIds = [];
        req.session.workout.exerciseNames = [];
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

        req.session.workout.exercises = [];
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
