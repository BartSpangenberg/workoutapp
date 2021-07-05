const router = require('express').Router();
const ExerciseModel = require('../models/Exercise.model');
const WorkoutModel = require('../models/Workout.model');

router.get('/library/search', (req, res, next) => {
    const workoutSearchWord = req.query.workoutName;
    WorkoutModel.find({ "name": { "$regex": workoutSearchWord, "$options": "i" }}) 
        .then((foundWorkouts) => {
            console.log(foundWorkouts)
            res.render('library/search-basic.hbs', foundWorkouts);
        }).catch((err) => {
            console.log('Something went wrong while searching for workouts', err)  
        });
})

router.get('/library/search/advanced', (req, res, next) => {
    res.render('library/search-advanced.hbs');
})

router.get('/library/workout-information/:id', (req, res, next) => {
    res.render('library/workout-information.hbs')
})

module.exports = router;
