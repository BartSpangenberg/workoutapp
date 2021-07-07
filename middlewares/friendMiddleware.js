const UserModel = require("../models/User.model");
const UserWorkoutModel = require("../models/UserWorkout.model");

const checkFriendRequests = (req, res, next) => {
    UserModel.findById(req.session.userInfo._id)
        .then((loggedInUser) => {
            if (!loggedInUser.friendRequests.length) {
                next();
            } else {
                req.session.userInfo.friendRequests = loggedInUser.friendRequests;
                console.log("USERINFO", req.session.userInfo)
                res.redirect('/friends/friend-request');
            } 
        }).catch((err) => {
            next();
        });
}

const checkIfUserHasFriends = (req, res, next) => {
    let userId = req.session.userInfo._id;
    UserModel.findById(userId)
        .then((loggedInUser) => {
            if (!loggedInUser.friends.length) {
                res.redirect('/library/create-workout/date')
            } 
            else {
                next();
            }
        }).catch(() => {
            res.redirect('/library/create-workout/date');
        });
}

const checkWorkoutRequests = (req, res, next) => {
    let userId = req.session.userInfo._id;
    UserModel.findById(userId)
        .then((loggedInUser) => {
            if (!loggedInUser.workoutRequests.length) {
                next();
            } 
            else {
                req.session.workoutRequests = loggedInUser.workoutRequests
                res.redirect('/library/create-workout/workout-request');
            }
        }).catch(() => {
            next();
        });
}

module.exports = {
    checkFriendRequests,
    checkIfUserHasFriends,
    checkWorkoutRequests
}