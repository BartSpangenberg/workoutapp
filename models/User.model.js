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
    enum: ["Lannister / Targaryan", "Beginner", "Intermediate", "Pro", "Stark"],
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  birthday: {
    type: Date,
    default: Date.now,
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
});

const User = model("User", userSchema);

module.exports = User;
