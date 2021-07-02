// Use this file to seed the exercises collection
// You can do that by running: node .\seed\exercises.seed.js (or something similar)

require('../db');

const mongoose = require('mongoose');
const axios = require('axios');
const ExerciseModel = require('../models/Exercise.model.js');

async function getExerciseData() {
    try {
        const eqpuipmentData = await axios.get('https://wger.de/api/v2/equipment/?format=json');  
        const muscleData = await axios.get('https://wger.de/api/v2/muscle/?format=json');
        const exerciseData = await axios.get('https://wger.de/api/v2/exercise/?%3Flimit=1000&format=json&language=2&limit=2000');
        const imageData = await axios.get('https://wger.de/api/v2/exerciseimage/?format=json&limit=2000');

        // Combine the data from the 4 API request into 1 array with exercise objects
        exercises = ConvertExerciseData(exerciseData.data.results);
        addImageUrlToExercises(exercises, imageData.data.results);
        addEquipmentToExercises(exercises, eqpuipmentData.data.results);
        addMusclesToExercises(exercises, muscleData.data.results);

        // Write data to the database
        ExerciseModel.create(exercises)
            .then(() => {
                mongoose.connection.close();
            })
            .catch(err => {
                console.log('Seeding went wrong', err.response)
                mongoose.connection.close();
            })
    }
    catch {
        console.log('Failed to get data');
    }
}  

getExerciseData();

// The 4 helper functions below manipulate the data from the API.
// See function names to find out what they do
function ConvertExerciseData(exerciseArray) {
    // Descriptions have html tags in them. 
    // Maybe remove them later.
    // For now I left it in there
    exercises = [];
    exerciseArray.forEach(exercise => {
        exercises.push({
            name: exercise.name,
            description: exercise.description,
            equipmentNumbers: exercise.equipment,
            exerciseImageNumber: exercise.exercise_base,
            musclesNumbers: exercise.muscles
        })
    })
    return exercises
}

function addImageUrlToExercises(exerciseArray, imageArray) {
    exerciseArray.forEach(exercise => {
        imageArray.forEach(imageObj => {
            if (exercise.exerciseImageNumber === imageObj.exercise_base) {
                exercise.image = imageObj.image;
            }
        })
    })
}

function addEquipmentToExercises(exerciseArray, equipmentObjectsArray) {
    exerciseArray.forEach(exercise => {
        exercise.equipmentNumbers.forEach(equipmentNumber => {
            equipmentObjectsArray.forEach(equipmentPiece => {
                if (equipmentNumber === equipmentPiece.id ) {
                    ("equipments" in exercise) ? exercise.equipments.push(equipmentPiece.name) : exercise.equipments = [equipmentPiece.name];
                }
            })
        })
    }) 
}

function addMusclesToExercises(exerciseArray, muscleObjectsArray) {
    exerciseArray.forEach(exercise => {
        exercise.musclesNumbers.forEach(musclesNumber => {
            muscleObjectsArray.forEach(individualMuscle => {
                if (musclesNumber === individualMuscle.id ) {
                    ("muscles" in exercise) ? exercise.muscles.push(individualMuscle.name) : exercise.muscles = [individualMuscle.name];
                }
            })
        })
    }) 
}
