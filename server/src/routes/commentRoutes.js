import express from "express";

import {
  createComment,
  getComments,
} from "../controllers/commentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createComment);

router.get("/:incidentId", getComments);

export default router;