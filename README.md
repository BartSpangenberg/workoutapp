# Project Name
WorkoutApp

## Description
As a user, I would like to improve my health by doing workouts. You can select, create an track workouts and see valuable statistics.

 
## User Stories

**404** 
- As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 

**500** 
- As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

**landing** 
- Landing page displays information about application and navigation to authentication screens

**sign up** 
- As a user I want to sign up on the webpage so that I can see all the events that I could attend
- User can set profile information in the signup-flow

**login** 
- As a user I want to be able to log in on the webpage so that I can get back to my account

**logout** 
- As a user I want to be able to log out from the webpage so that I can make sure no one will access my account

**My Workouts** 
- Users can see their workouts with general information and information about all the exercises
- Users can add their workouts to their workout to-do
- Users can add their previous workouts to their workout to-do

**Workout Library**
- User can search for workouts in the workout library
- User can do advanced search by searching for various workout properties
- User can see more information on the workout

**Workout creation**
- User can create workouts
- User can add exercises to each workout
- User can create new exercises

**Profile**
- User can see profile page
- User can set a profile image
- User can modify profile information

## Backlog
**Achievements & Statistics**
- User can earn achievements for reaching certain milestones
- User can see statistics on workout progresssions

**Workout Library**
- User can manually edit the amount of sets and reps for each exercise
- The search results are paginated

**My Workouts** 
- User receives personalized workout suggestions

**Responsive UI**
- UI is responsive to desktop, tablet and mobile

**CRUD ADMIN**
- Special admins ('trainers') can CRUD exercises and workouts that are created by users
- Therefore we would have multiple admin roles
- Admin role would be able to asign the trainer-role to existing user

**Multilingual**
- Static content is translatable from admin
- Dynamic content is auto-translated

**Schedule workouts**
- User can schedule workouts for specific dates


## ROUTES:

GET / 
  - renders the landingpage
GET /signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)
POST /auth/signup
  - redirects to / if user logged in
  - body:
    - username
    - email
GET /login
  - redirects to / if user logged in
  - renders the login form (with flash msg)
POST /login
  - redirects to / if user logged in
  - body:
    - username
    - password
POST /auth/logout
  - body: (empty)

POST : /signup/athlete
 - Redirect and store data temporary & redirect to next page --> same for all pages in signup flow
POST : /signup/body
POST : /signup/birthday
POST : /signup/goals
POST : /signup/journey
POST : /signup/profile-created
 - Create signup in the databse

GET: /myworkouts/:user
- Renders myworkouts page for specific user

GET: /myworkouts/workout-information/:workout

GET: /library/search

GET: /library/search
POST: /library/search 
- Display search results 

GET: /library/workout-information/:workout
POST: /library/workout-information/:workout
- Modify reps and sets & store database in user object

GET: /library/search/advanced
POST: /library/search/advanced
- Display search results 

GET: /library/create-workout
POST: /library/create-workout

GET: /library/create-exercise
POST: /library/create-exercise

GET: /profile/:user

GET: /achievements/:user

GET:  /profile/:user/edit-username
POST: /profile/:user/edit-username
GET:  /profile/:user/edit-goals
POST: /profile/:user/edit-goals
GET:  /profile/:user/edit-athlete
POST: /profile/:user/edit-athlete
GET:  /profile/:user/edit-body
POST: /profile/:user/edit-body
GET:  /profile/:user/edit-birthdate
POST: /profile/:user/edit-birthdate
GET:  /profile/:user/edit-password
POST: /profile/:user/edit-password

## Models
```
User model (mvp version) 
username: String
password: String
email: String
athleteLevel: String
height: Number
weight: Number
goals: Array of strings
birthday: Timestamp
isFirstTimeLogin: Boolean
workouts: Array of objects
```

```
Workout model (mvp version) 
name: String
description: String
goals: Array of strings
type: String
athleteLevel: String
duration: Number
intensity: String
amountOfTimesSelected: Number
createdBy: ObjectId<User>
exercises: Array of ofbjects (ObjectId<Exercise>, repUnit, reps, sets)
``` 

```
Exercise model
name: String
description: String
Equipment: String
image_url: String
```

## Links

### Trello

[Link to your trello board](https://trello.com) or picture of your physical board

### Git

The url to your repository and to your deployed project

[Repository Link](http://github.com)

[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)
