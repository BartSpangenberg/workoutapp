const router = require('express').Router();
const ExerciseModel = require('../models/Exercise.model');
const WorkoutModel = require('../models/Workout.model');
const { types, levels, goalsArr, intensities, unitTypes, equipments, muscles } = require('../data/workoutData');
const {
    createOptionsForAdvancedSearchForm,
    turnSearchRequestIntoQueryData
} = require('./library.helper');
const searchOptions = createOptionsForAdvancedSearchForm();

const amountOfSearchResultsPerPage = 3;

router.get('/library/search', (req, res, next) => {
    if (!("workoutName" in req.query)) {
        res.render('library/search-basic.hbs');
        return;
    } 

    const workoutSearchWord = req.query.workoutName;
    WorkoutModel.find({ "name": { "$regex": workoutSearchWord, "$options": "i" }}) 
        .then((foundWorkouts) => {
            res.render('library/search-basic.hbs', {foundWorkouts});
        }).catch((err) => {
            console.log('Something went wrong while searching for workouts', err)  
        });
})

router.get('/library/search/advanced', (req, res, next) => {
    const { workoutName, type, minDuration, maxDuration, level, goals, intensity } = req.query;
    console.log(req.query)
    if (!("workoutName" in req.query)) {
        console.log("I run")
        res.render('library/search-advanced.hbs', { searchOptions });
        return;
    } 

    const searchData = turnSearchRequestIntoQueryData(type, minDuration, maxDuration, level, goals, intensity);
    console.log(searchData)

    // The document count of the query will be used to determine how many pages there will be
    WorkoutModel
        .countDocuments({ $and: [{ "name": { "$regex": workoutName, "$options": "i" },  type: { $in: searchData.type }, athleteLevel: { $in: searchData.level }, intensity: { $in: searchData.intensity }, goals: { $in: searchData.goals }, duration: { $gte: searchData.minDuration, $lte: searchData.maxDuration } }] })
        .exec((err, count) => {
            console.log("Something went wrong while counting the workouts", err)
        })

    WorkoutModel.find({ "name": { "$regex": workoutName, "$options": "i" }}) 
        .where('type').in(searchData.type)
        .where('athleteLevel').in(searchData.level)
        .where('intensity').in(searchData.intensity)
        .where('goals').in(searchData.goals)
        .where('duration').gte(searchData.minDuration).lte(searchData.maxDuration)
        // .skip(10)
        // .limit(5)
        .exec()

    .then((foundWorkouts) => {
        // console.log(foundWorkouts)
        res.render('library/search-advanced.hbs', { searchOptions, foundWorkouts });
    }).catch((err) => {
        console.log('Something went wrong while searching for workouts', err)  
    });
})

router.get('/library/workout-information/:id', (req, res, next) => {
    res.render('library/workout-information.hbs')
})

module.exports = router;
