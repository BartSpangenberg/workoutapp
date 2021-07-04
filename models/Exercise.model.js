const { Schema, model } = require("mongoose");

// Might be useful for setting default values for arrays, if not remove it
// const equipmentSchema = new Schema({
//     type: String, 
//     default: 'none'
// })

// const defaulMuscleSchema = new Schema({
//     type: String, 
//     default: 'None (bodyweight exercise)'
// })

const exerciseSchema = new Schema({
    name: {
    type: String,
    required: true,
    unique: true
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
        // default: [defaulMuscleSchema]
    },
    muscles: {
        type: Array
        // default: [`I haven't the faintest idea`]
    },
    popularity: {
        type: Number
    }
});

const ExerciseModel = model("Exercise", exerciseSchema);

module.exports = ExerciseModel;
