import express from "express";

import {
  createIncident,
  getIncidents,
  getNearbyIncidents,
} from "../controllers/incidentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getIncidents);

router.get("/nearby", getNearbyIncidents);

router.post(
  "/",
  authMiddleware,
  createIncident
);

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const incident = await (await import("../models/Incident.js")).default.findById(req.params.id);
      if (!incident) return res.status(404).json({ message: "Not found" });
      
      // Check if owner or admin
      if (incident.user?.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }

      await incident.deleteOne();
      res.json({ message: "Deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;