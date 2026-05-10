import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema({
  title: String,

  description: String,

  type: {
    type: String,
    enum: [
      "accident",
      "traffic",
      "flood",
      "roadblock",
      "pothole",
      "construction",
      "debris",
      "animal",
      "uturn",
      "breakdown",
      "light",
      "other"
    ],
  },

  severity: {
    type: String,
    enum: ["low", "medium", "high"],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  imageUrls: [String],

  location: {
    type: {
      type: String,
      default: "Point",
    },

    coordinates: [Number],
  },

  status: {
    type: String,
    default: "active",
  },

  expiresAt: {
    type: Date,
    default: () =>
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    index: {
      expires: 0,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

IncidentSchema.index({
  location: "2dsphere",
});

export default mongoose.model(
  "Incident",
  IncidentSchema
);
