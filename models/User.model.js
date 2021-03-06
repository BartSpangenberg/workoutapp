const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
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
});

const User = model("User", userSchema);

module.exports = User;
