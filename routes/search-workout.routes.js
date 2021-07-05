const router = require('express').Router();
const UserWorkoutModel = require('../models/UserWorkout.model');
const WorkoutModel = require('../models/Workout.model');
const { types, levels, goalsArr, intensities, unitTypes, equipments, muscles } = require('../data/workoutData');
const {
    createOptionsForAdvancedSearchForm,
    turnSearchRequestIntoQueryData,
    createPageNumberArr,
    convertWorkoutDataIntoArrayOfTags,
    createUserWorkoutFromSearch
} = require('./library.helper');

const searchOptions = createOptionsForAdvancedSearchForm();
let searchData = turnSearchRequestIntoQueryData();
let basicSearchData = turnSearchRequestIntoQueryData();
const workoutsPerPage = 3;
let workoutCount = 0;
let pageCount = 1;
let skipCount = 0;
let basicSkipCount = 0;
let pageNumberArr;

router.get('/library/search', (req, res, next) => {
    const { workoutName, button, paginationBtn } = req.query;
    // When the user clicks on the search button a new search query needs to be created
    if (button === 'search') {
        basicSearchData = turnSearchRequestIntoQueryData(workoutName);
        // The search data needs to be stored in the session so that it can be re-called when the user clicks on a pagination button
        req.session.basicSearchData = basicSearchData;
    }

    if ("paginationBtn" in req.query) {
        basicSkipCount =  workoutsPerPage * (+paginationBtn) - workoutsPerPage;
    }

    // The workoutCount of the query will be used to determine how many pages there will be
    basicSearchData = req.session.basicSearchData;
    WorkoutModel
        .countDocuments({ "name": { "$regex": basicSearchData.workoutName, "$options": "i" }})
            .then((count) => {
                workoutCount =  count;
                pageCount = Math.ceil( workoutCount / workoutsPerPage );
                pageNumberArr = createPageNumberArr(pageCount);
                basicSkipCount = 0;
            }).catch((err) => {
                console.log("something went wrong while counting the workouts" , err);
            });

    WorkoutModel.find({ "name": { "$regex": basicSearchData.workoutName, "$options": "i" }}) 
        .skip(basicSkipCount)   
        .limit(workoutsPerPage)
        .then((foundWorkouts) => {
            res.render('library/search-basic.hbs', {foundWorkouts, pageNumberArr });
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
        skipCount =  workoutsPerPage * (+paginationBtn) - workoutsPerPage;
    }

    // The workoutCount of the query will be used to determine how many pages there will be
    SearchData = req.session.SearchData;
    WorkoutModel
        .countDocuments({ $and: [{ "name": { "$regex": searchData.workoutName, "$options": "i" },  type: { $in: searchData.type }, athleteLevel: { $in: searchData.level }, intensity: { $in: searchData.intensity }, goals: { $in: searchData.goals }, duration: { $gte: searchData.minDuration, $lte: searchData.maxDuration } }] })
            .then((count) => {
                workoutCount =  count;
                pageCount = Math.ceil( workoutCount / workoutsPerPage );
                pageNumberArr = createPageNumberArr(pageCount);
                skipCount = 0;
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
                res.render('library/search-advanced.hbs', { searchOptions, foundWorkouts, pageNumberArr });
            }).catch((err) => {
                console.log('Something went wrong while searching for workouts', err)  
            });
})

router.get('/library/workout-information/:id', (req, res, next) => {
    const { id } = req.params;
    WorkoutModel.findById(id)
        .populate('exercises.exerciseId')
        .then((workoutData) => {
            const tags = convertWorkoutDataIntoArrayOfTags(workoutData);
            res.render('library/workout-information.hbs', {workoutData, tags})
        }).catch((err) => {
            console.log("Something went wrong while searching for the workout", err);
        });
})

router.post('/library/workout-information/:id', (req, res, next) => {
    const { id } = req.params;
    const { reps, sets, restBetweenSets, restBetweenExercises } = req.body;

    WorkoutModel.findByIdAndUpdate(id, { $inc: { timesSelected: 1 } })
        .populate('exercises.exerciseId')
        .then((workoutData) => {
            let newUserWorkout = createUserWorkoutFromSearch(workoutData, reps, sets, restBetweenSets, restBetweenExercises, req.session.userInfo);    
            return UserWorkoutModel.create(newUserWorkout)
        }).then(() => {
            res.send('Redirect to My Workouts');
        }).catch((err) => {
            console.log("Something went wrong while creating a new UserWorkout", err)
        });
})

module.exports = router;
