const { Schema, model } = require("mongoose");

// Might be useful for setting default values for arrays, if not remove it
// const equipmentSchema = new Schema({
//     type: String, 
//     default: 'none'
// })

// const muscleSchema = new Schema({
//     type: String, 
//     default: 'none'
// })

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const exerciseSchema = new Schema({
    name: {
    type: String,
    required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    equipments: {
        type: Array
    },
    muscles: {
        type: Array
    }
});

const ExerciseModel = model("Exercise", exerciseSchema);

module.exports = ExerciseModel;
