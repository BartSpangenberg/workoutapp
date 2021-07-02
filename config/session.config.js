const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

module.exports = app => {
    // Not sure what it means
    app.set('trust proxy', 1); // This seems to be required to have when we deploy to Heroku (production version)

    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: true, // don't create session until something stored
            saveUnitialized: false, //don't save session if unmodified
            cookie: {
                maxAge: 1000 * 86400 // 1000 days 
            },
            store: MongoStore.create({
            mongoUrl: MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/workoutapp",
            ttl: 30 * 86400
            })
        })
    )
}
