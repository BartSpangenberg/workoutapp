const router = require('express').Router();
const ExerciseModel = require('../models/Exercise.model');
const WorkoutModel = require('../models/Workout.model');
const { types, levels, goalsArr, intensities, unitTypes, equipments, muscles } = require('../data/workoutData');
const {
    createOptionsForAdvancedSearchForm,
    turnSearchRequestIntoQueryData,
    createPageNumberArr,
} = require('./library.helper');

const searchOptions = createOptionsForAdvancedSearchForm();
let searchData = turnSearchRequestIntoQueryData();
const workoutsPerPage = 3;
let workoutCount = 0;
let pageCount = 1;
let skipCount = 0;
let pageNumberArr;

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
    const { workoutName, type, minDuration, maxDuration, level, goals, intensity, button, paginationBtn } = req.query;
    // When the user clicks on the search button a new search query needs to be created
    if (button === 'search') {
        searchData = turnSearchRequestIntoQueryData(workoutName, type, minDuration, maxDuration, level, goals, intensity);
        
        // The search data needs to be stored in the session so that it can be re-called when the user clicks on a pagination button
        req.session.searchData = searchData;
    }

    if ("paginationBtn" in req.query) {
        console.log(+paginationBtn)
        skipCount =  workoutsPerPage * (+paginationBtn) - workoutsPerPage;
        console.log('Skipcount:', skipCount)
    }

    // The workoutCount of the query will be used to determine how many pages there will be
    WorkoutModel
        .countDocuments({ $and: [{ "name": { "$regex": searchData.workoutName, "$options": "i" },  type: { $in: searchData.type }, athleteLevel: { $in: searchData.level }, intensity: { $in: searchData.intensity }, goals: { $in: searchData.goals }, duration: { $gte: searchData.minDuration, $lte: searchData.maxDuration } }] })
            .then((count) => {
                workoutCount =  count;
                pageCount = Math.ceil( workoutCount / workoutsPerPage );
                pageNumberArr = createPageNumberArr(pageCount);
            }).catch((err) => {
                console.log("something went wrong while counting the workouts" , err);
            });
    
    WorkoutModel.find({ "name": { "$regex": searchData.workoutName, "$options": "i" }}) 
        .where('type').in(searchData.type)
        .where('athleteLevel').in(searchData.level)
        .where('intensity').in(searchData.intensity)
        .where('goals').in(searchData.goals)
        .where('duration').gte(searchData.minDuration).lte(searchData.maxDuration)
        .skip(skipCount)
        .limit(workoutsPerPage)
        .exec()
            .then((foundWorkouts) => {
                // console.log(foundWorkouts)
                res.render('library/search-advanced.hbs', { searchOptions, foundWorkouts, pageNumberArr });
            }).catch((err) => {
                console.log('Something went wrong while searching for workouts', err)  
            });
})

router.get('/library/workout-information/:id', (req, res, next) => {
    res.render('library/workout-information.hbs')
})

module.exports = router;
