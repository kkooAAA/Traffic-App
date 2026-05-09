import Incident from "../models/Incident.js";
import { getIO } from "../services/socket.js";

export const createIncident = async (
  req,
  res
) => {
  try {
    const incident = await Incident.create({
      ...req.body,
      user: req.user.id
    });

    getIO().emit("newIncident", incident);

    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getIncidents = async (
  req,
  res
) => {
  try {
    const incidents = await Incident.find().sort({
      createdAt: -1,
    });

    res.json(incidents);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getNearbyIncidents = async (
  req,
  res
) => {
  const { lng, lat } = req.query;

  const incidents = await Incident.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [
            Number(lng),
            Number(lat),
          ],
        },

        $maxDistance: 3000,
      },
    },
  });

  res.json(incidents);
};