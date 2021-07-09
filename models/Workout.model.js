const { Schema, model } = require("mongoose");

const nestedExerciseSchema = new Schema({
   exerciseId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Exercise' 
    },
    unitType: {
        type: String,
        enum: ['Minutes', 'Reps', 'Meter', 'Km']
    },
    reps: Number,
    sets: Number,
    restBetweenSets: Number,
    restBetweenExercises: Number
});

const workoutSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    default: "Super Trainer"
  },
  timesSelected: {
    type: Number,
    default: 1
  },
  description: String,
  type: {
    type: String,
    enum: ['Bodyweight', 'Gym', 'Outdoor', 'Athlete', 'Mobility', 'Endurance']
  },
  duration: {
      type: Number,
      min: 1,
      max: 600
  },
  athleteLevel: {
      type: String,
      enum: ['Lannister / Targaryen', 'Beginner', 'Advanced', 'Pro', 'Stark']
  },
  goals: String,
  intensity: {
      type: String,
      enum: ['Low', 'Medium', 'High']
  },
  exercises: [nestedExerciseSchema]
});

const WorkoutModel = model("Workout", workoutSchema);

module.exports = WorkoutModel;

