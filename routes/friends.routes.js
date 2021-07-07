const router = require('express').Router();
const checkLoggedIn = require("../middlewares/loggedInMiddleware");
const UserModel = require("../models/User.model");
const navBarClasses = require('../data/navbarClasses');
let newFriendId = '';

router.get('/friends', checkLoggedIn, (req, res, next) => {
    res.render("friends/friends.hbs", { navBarClasses })
})

router.post('/friends', checkLoggedIn, (req, res, next) => {
    const { friendRequest } = req.body;
    // username uniquee
    // search database on username
    UserModel.find({ username: friendRequest })
        .then((friendUser) => {
            if(!friendUser.length) {
                let error = {
                    msg: "Username was not found."
                }
                res.render("friends/friends.hbs", { navBarClasses, error })
                return
            }

            if(friendUser[0].username === req.session.userInfo.username) {
                let error = {
                    msg: "You cannot send friend requests to yourself."
                }
                res.render("friends/friends.hbs", { navBarClasses, error })
                return
            }

            // The next step is to check if the user is already a friend
            newFriendId = friendUser[0]._id;
            return UserModel.findById(req.session.userInfo._id)
            
        }).then((loggedInUser) => {
            
            if (loggedInUser.friends.includes(newFriendId)) {
                let error = {
                    msg: "You are already friends with this user."
                }
                res.render("friends/friends.hbs", { navBarClasses, error })
                return
            }

            if (loggedInUser.friendRequests.includes(newFriendId)) {
                let error = {
                    msg: "Friend request has already been send."
                }
                res.render("friends/friends.hbs", { navBarClasses, error })
                return
            }

            // If the user is not already a friend, or the friend request has already been send, then we can add it to the friendRequests array.
            return UserModel.findByIdAndUpdate(req.session.userInfo._id, { $push: { friendRequests: newFriendId }})

        }).then((userThatReceivesRequest) => {
            let suc = {
                msg: "Friend request has been sent."
            }

            res.render("friends/friends.hbs", { navBarClasses, suc })
        }).catch((err) => {
            let error = {
                msg: "Username was not found."
            }
            res.render("friends/friends.hbs", { navBarClasses, error })
        });
})


module.exports = router;