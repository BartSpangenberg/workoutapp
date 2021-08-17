# Project Name

WorkoutY

## Description

As a user, I would like to improve my health by doing workouts. With WorkoutY I can select workouts from a large library or I can create mine with customised exercises. To stay motivated, I can add some friends and schedule workouts with them. Let's give it a try, [here](https://workouty.herokuapp.com/) !


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


**Workout Library**

- User can manually edit the amount of sets and reps for each exercise
- The search results are paginated

**Schedule workouts**

- User can schedule workouts for specific dates

**Social interactions**

- User can add some friends
- User can schedule workouts with friends and send invitations


**=> If time :**

**Achievements & Statistics**

- User can earn achievements for reaching certain milestones
- User can see statistics on workout progresssions

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



## ROUTES:

### Authentification Routes : 

- GET /signup 
- POST /signup
- GET /signup/trainer-name
- POST /signup/trainer-name
- GET /signup/athlete
- POST /signup/athlete
- GET /signup/body
- POST /signup/body
- GET /signup/birthday
- POST /signup/birthday
- GET /signup/goals
- POST /signup/goals
- GET /login
- POST /login
- GET /logout

### To main Page Routes : 

- GET /

### Create workouts Routes : 

- GET /library/create-workout 
- POST /library/create-workout
- GET /library/create-exercise
- POST /library/create-exercise
- GET /library/create-workout/exercise-pop-up
- POST /library/create-workout/exercise-pop-up
- GET /library/create-workout/friends
- POST /library/create-workout/friends
- GET /library/create-workout/date
- POST /library/create-workout/date
- GET /library/create-workout/workout-request
- POST /library/create-workout/workout-request

### Friends Routes : 

- GET /friends
- POST /friends
- GET /friends/friend-request
- POST /friends/friend-request

### Profile Routes : 

- GET /profile
- POST /upload
- GET /profile/edit/username
- POST /profile/edit/username
- GET /profile/edit/email
- POST /profile/edit/email
- GET /profile/edit/password
- POST /profile/edit/password
- GET /profile/edit/birthday
- POST /profile/edit/birthday
- GET /profile/edit/trainername
- POST /profile/edit/trainername
- GET /profile/edit/goals
- POST /profile/edit/goals
- GET /profile/edit/athletetype
- POST /profile/edit/athletetype
- GET /profile/edit/body
- POST /profile/edit/body

### Profile Routes : 

- GET /library/search
- GET /library/search/advanced
- GET /library/workout-information/:id
- POST /library/workout-information/:id

### Profile Routes : 

- GET /myworkouts
- GET /myworkouts/:id/done
- GET /myworkouts/:id/scheduled
- GET /myworkouts/workout-information/:id


## Models

```
User model (mvp version)

email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  trainername: {
    type: String,
  },
  athleteType: {
    type: String,
    enum: ["Lannister / Targaryen", "Beginner", "Intermediate", "Pro", "Stark"],
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  birthday: {
    type: Date,
  },
  goals: {
    type: [String],
    enum: [
      "Get Summer fit",
      "More Athletic",
      "Lose Weight",
      "Run a Marathon",
      "Improve endurance",
      "Build muscle",
    ],
  },
  userWorkouts: {
    type: Schema.Types.ObjectId,
    ref: "Workout",
  },
  friends: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  friendRequests: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  workoutRequests: [{
    type: Schema.Types.ObjectId, 
    ref: 'UserWorkout' 
  }],
  profilePic: {
    type: String,
    default :"/images/avatar.png"
  }
```

```
Workout model (mvp version)

name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    default: "Super Trainer"
  },
  timesSelected: {
    type: Number,
    default: 1
  },
  description: String,
  type: {
    type: String,
    enum: ['Bodyweight', 'Gym', 'Outdoor', 'Athlete', 'Mobility', 'Endurance']
  },
  duration: {
      type: Number,
      min: 1,
      max: 600
  },
  athleteLevel: {
      type: String,
      enum: ['Lannister / Targaryen', 'Beginner', 'Advanced', 'Pro', 'Stark']
  },
  goals: String,
  intensity: {
      type: String,
      enum: ['Low', 'Medium', 'High']
  },
  exercises: [nestedExerciseSchema]
```

```
NestedExerciseSchema

exerciseId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Exercise' 
    },
    unitType: {
        type: String,
        enum: ['Minutes', 'Reps', 'Meter', 'Km']
    },
    reps: Number,
    sets: Number,
    restBetweenSets: Number,
    restBetweenExercises: Number

```

```
Exercise model

name: {
    type: String,
    required: true,
    unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://i.pinimg.com/originals/9d/60/72/9d6072c41e19a5cb61b020b51691ff5a.jpg"
    },
    equipments: {
        type: Array,
        default: ["None (bodyweight exercise)"]
    },
    muscles: {
        type: Array,
        default: ["I haven't the faintest idea"]
    },
    popularity: {
        type: Number
    }
```

```
User workout model : 

userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }, 
    scheduled: {
        type: Boolean,
        default: true
    },
    dateSchedule: {
        type: Date
    },
    timesCompleted: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: true,
    },
    description: String,
    type: {
        type: String,
        enum: ['Bodyweight', 'Gym', 'Outdoor', 'Athlete', 'Mobility', 'Endurance']
    },
    duration: {
        type: Number,
        min: 1,
        max: 600
    },
    athleteLevel: {
        type: String,
        enum: ['Lannister / Targaryen', 'Beginner', 'Advanced', 'Pro', 'Stark']
    },
    goals: Array,
    intensity: {
        type: String,
        enum: ['Low', 'Medium', 'High']
    },
    exercises: [nestedExerciseSchema],
    friend: {
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }, 
    date: {
        type: String
    }

```


## Links

### Kanban in Notion

[Big steps](https://enchanting-tennis-ac6.notion.site/e04ae61640004d9998dbf765d58acdc5?v=090d55a63aa74b129028e994848ef6fe)

[Small steps](https://enchanting-tennis-ac6.notion.site/e3c07ffd848f4cc3a542e814ab03fb21?v=f31691c141d440ebb9a4cfb43250c066)

### Whimsical

[Whimsical board](https://whimsical.com/the-beginning-PCCQ9CAQYFGFhAWkGd7na7)

### Git

[Repository Link](https://github.com/BartSpangenberg/workoutapp)

[Deploy Link](https://workouty.herokuapp.com/)

### Slides

[Presentation Slides Link](https://docs.google.com/presentation/d/16unQHb8jNxSHZ85tRwVt5M7LbarVno86yMXp5KZ-c4Q/edit?usp=sharing)
