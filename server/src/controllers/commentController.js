import Comment from "../models/Comment.js";
import Incident from "../models/Incident.js";
import User from "../models/User.js";
import { getIO } from "../services/socket.js";

export const createComment = async (
  req,
  res
) => {
  try {
    const { incidentId, content } = req.body;
    
    const comment = await Comment.create({
      incidentId,
      content,
      userId: req.user.id
    });

    const populatedComment = await Comment.findById(comment._id).populate("userId", "username");
    
    // Logic for Credential System:
    // If a user (not the owner) comments, the incident reporter gets credits
    const incident = await Incident.findById(incidentId);
    if (incident && incident.user.toString() !== req.user.id) {
      const reporter = await User.findById(incident.user);
      if (reporter) {
        reporter.credits = (reporter.credits || 0) + 5; // +5 credits for helpful report
        await reporter.save();
        
        // Notify the reporter about their new credits
        getIO().emit("creditUpdate", { 
          userId: reporter._id, 
          credits: reporter.credits 
        });
      }
    }

    getIO().emit("newComment", populatedComment);

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.content = content;
    await comment.save();

    const populatedComment = await Comment.findById(id).populate("userId", "username");
    getIO().emit("updateComment", populatedComment);

    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await comment.deleteOne();
    getIO().emit("deleteComment", { id, incidentId: comment.incidentId });

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComments = async (
  req,
  res
) => {
  try {
    const comments = await Comment.find({
      incidentId: req.params.incidentId,
    }).populate("userId", "username");

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};