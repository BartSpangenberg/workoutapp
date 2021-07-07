const UserModel = require("../models/User.model");

const checkFriendRequests = (req, res, next) => {
    UserModel.findById(req.session.userInfo._id)
        .then((loggedInUser) => {
            console.log('Middleware friendrequests:', loggedInUser.friendRequests)
            if (!loggedInUser.friendRequests.length) {
                next();
            } else {
                req.session.userInfo.friendRequests = loggedInUser.friendRequests;
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
            redirect('/library/create-workout/date');
        });
}

module.exports = {
    checkFriendRequests,
    checkIfUserHasFriends
}