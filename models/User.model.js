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
  trainername: {
    type: String,
    required: true,
  },
  password: String,
  athleteType: {
    type: String,
    required: true,
    enum: ["Lannister / Targaryan", "Beginner", "Intermediate", "Pro", "Stark"],
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  goals: {
    type: String,
    required: true,
    enum: [
      "Get Summer fit",
      "More Athletic",
      "Lose Weight",
      "Run a Marathon",
      "Improve endurance",
      "Build muscle",
    ],
  },
});

const User = model("User", userSchema);

module.exports = User;
