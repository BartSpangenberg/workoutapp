const router = require('express').Router();
const checkLoggedIn = require("../middlewares/loggedInMiddleware");
const UserModel = require("../models/User.model");
const navBarClasses = require('../data/navbarClasses');
const User = require('../models/User.model');
let newFriendId = '';

router.get('/friends', checkLoggedIn, (req, res, next) => {
    UserModel.findById(req.session.userInfo._id)
        .populate('friends')
        .then((loggedInUser) => {
            const { friends } = loggedInUser;
            res.render("friends/friends.hbs", { navBarClasses, friends })
            
        }).catch((err) => {
            
        });
})

router.post('/friends', checkLoggedIn, (req, res, next) => {
    const { friendRequest } = req.body;
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
            
            if (friendUser[0].friendRequests.includes(req.session.userInfo._id)) {
                let error = {
                    msg: "Friend request has already been send."
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

            // If the user is not already a friend, or the friend request has already been send
            // Then we can add it to the friendRequests array of the user we send a request to
            return UserModel.findByIdAndUpdate(newFriendId, { $push: { friendRequests: req.session.userInfo._id }})

        }).then((userThatReceivesRequest) => {
            let suc = {
                msg: "Friend request has been sent."
            }

            res.render("friends/friends.hbs", { navBarClasses, suc })
        }).catch((err) => {
            let error = {
                msg: "Something went wrong, please try again."
            }
            res.render("friends/friends.hbs", { navBarClasses, error })
        });
})

router.get('/friends/friend-request', (req, res, next) => {
    let = newFriendId = req.session.userInfo.friendRequests[0];

    UserModel.findById(newFriendId)
        .then((friendThatSendRequest) => {
            res.render("friends/friend-request.hbs", { friendThatSendRequest })
        }).catch((err) => {
            res.redirect('/myworkouts')
        });
})

router.post('/friends/friend-request', async (req, res, next) => {
    let newFriendId = req.session.userInfo.friendRequests[0];
    const { friendAction } = req.body;
    if (friendAction === 'decline') {
        UserModel.findByIdAndUpdate(req.session.userInfo._id, { $pull: { friendRequests: newFriendId }})
            .then((loggedInUser) => {
                res.redirect('/myworkouts')
            }).catch((err) => {
                res.redirect('/myworkouts')
            });    
    }
    if (friendAction === 'accept') {
        try {
            await UserModel.findByIdAndUpdate(req.session.userInfo._id, {  $push: { friends: newFriendId }, $pull: { friendRequests: newFriendId } })
            await UserModel.findByIdAndUpdate(newFriendId, {  $push: { friends: req.session.userInfo._id }} )
            res.redirect('/myworkouts');
        }
        catch(err) {
            res.redirect('/myworkouts');
        }
    }
})

module.exports = router;
