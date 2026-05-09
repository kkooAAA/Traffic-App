import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  incidentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Incident",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  content: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model(
  "Comment",
  CommentSchema
);