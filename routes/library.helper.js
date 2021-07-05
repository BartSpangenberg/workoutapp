const { types, levels, goalsArr, intensities, unitTypes, equipments, muscles } = require('../data/workoutData');

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
    }
    next();
}

function createIsCreatingWorkoutVariable(req, res, next) {
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

function createWorkoutObject(workoutObjectFromSession) {
    const {name, description, duration, type, level, goals, intensity, exercises, exerciseIds} = workoutObjectFromSession;
    let newWorkout = {
        name,
        description,
        duration: +duration,
        type: extractWorkoutDataFromSession(type),
        athleteLevel: extractWorkoutDataFromSession(level),
        goals: extractWorkoutDataFromSession(goals),
        intensity: extractWorkoutDataFromSession(intensity),
        exercises: addIdsToExercises(exercises, exerciseIds)
    }
    return newWorkout
}

function createNewExerciseObject(bodyObject, muscles, equipments) {
    const {name , description} = bodyObject;

    let muscleData = convertCheckboxData(bodyObject, muscles);
    let equipmentData = convertCheckboxData(bodyObject, equipments);

    let exerciseObj = {
        name,
        description,
        equipments: equipmentData.length > 0 ? equipmentData : equipments[0],
        muscles: muscleData.length > 0 ? muscleData : muscles[0]
    } 
    return exerciseObj
}

function createNewExerciseToAddToSession() {
    let newExercise = {
        reps: 10,
        sets: 1,
        restBetweenSets: 60,
        restBetweenExercises: 30,
        unitTypes: {
            Selected: unitTypes[0],
            NotSelected: unitTypes.slice(1)
        }
    }
    return newExercise
}

function createOptionsForAdvancedSearchForm() {
    const searchOptions = {
        types: {
            Selected: '',
            NotSelected: types
        },
        levels: {
            Selected: '',
            NotSelected: levels
        },
        goals: {
            Selected: '',
            NotSelected: goalsArr
        },
        intensities: {
            Selected: '',
            NotSelected: intensities
        }
    }
    return searchOptions
}

function turnSearchRequestIntoQueryData(type, minDuration, maxDuration, level, goals, intensity) {
    const searchData = {
        type: !type ? types : type,
        level: !level ? levels : level,
        goals: !goals ? goalsArr : goals,
        intensity: !intensity ? intensities : intensity,
        minDuration: !minDuration ? 1 : minDuration,
        maxDuration: !maxDuration ? 1000 : maxDuration,
    }
    return searchData
}

module.exports = {
    saveWorkoutDataInTheSession,
    turnExerciseArraysIntoOneArrayOfExerciseObjects,
    turnSessionDataIntoWorkoutObject,
    createArrayOfNotSelectedItems,
    resetSessionWorkoutData, 
    createIsCreatingWorkoutVariable, 
    convertCheckboxData, 
    extractWorkoutDataFromSession, 
    addIdsToExercises, 
    addExerciseNamesToWorkoutObj, 
    createWorkoutObject,
    createNewExerciseObject,
    createNewExerciseToAddToSession,
    createOptionsForAdvancedSearchForm,
    turnSearchRequestIntoQueryData
}