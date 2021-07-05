const router = require('express').Router();
const ExerciseModel = require('../models/Exercise.model');
const WorkoutModel = require('../models/Workout.model');
const { types, levels, goalsArr, intensities, unitTypes, equipments, muscles } = require('../data/workoutData');
const {createOptionsForAdvancedSearchForm} = require('./library.helper');

router.get('/library/search', (req, res, next) => {
    if (!("workoutName" in req.query)) {
        res.render('library/search-basic.hbs');
        return;
    } 

    const workoutSearchWord = req.query.workoutName;
    WorkoutModel.find({ "name": { "$regex": workoutSearchWord, "$options": "i" }}) 
        .then((foundWorkouts) => {
            console.log(foundWorkouts)
            res.render('library/search-basic.hbs', {foundWorkouts});
        }).catch((err) => {
            console.log('Something went wrong while searching for workouts', err)  
        });
})

router.get('/library/search/advanced', (req, res, next) => {
    const searchOptions = createOptionsForAdvancedSearchForm();
    console.log(req.query)
    if (!("workoutName" in req.query)) {
        console.log("I run")
        res.render('library/search-advanced.hbs', { searchOptions });
        return;
    } 

    // WORKING ON THIS
    // WorkoutModel.find({ "name": { "$regex": workoutSearchWord, "$options": "i" }}) 
    //     .where('type').in(types)
    //     .where('athleteLevel').in([])
    //     .where('goals').in([])
    //     .where('').in([])
    // .then((foundWorkouts) => {
    //     console.log(foundWorkouts)
    //     res.render('library/search-advanced.hbs', { searchOptions, foundWorkouts });
    // }).catch((err) => {
    //     console.log('Something went wrong while searching for workouts', err)  
    // });

})

router.get('/library/workout-information/:id', (req, res, next) => {
    res.render('library/workout-information.hbs')
})

module.exports = router;
