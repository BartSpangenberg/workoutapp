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

module.exports = checkFriendRequests