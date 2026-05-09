import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,

  email: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    select: false
  },

  role: {
    type: String,
    default: "user",
  },

  savedLocations: [
    {
      name: String,
      coordinates: [Number],
    },
  ],
});

export default mongoose.model("User", UserSchema);