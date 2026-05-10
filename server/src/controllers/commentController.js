import Comment from "../models/Comment.js";
import { getIO } from "../services/socket.js";

export const createComment = async (
  req,
  res
) => {
  try {
    const comment = await Comment.create({
      ...req.body,
      userId: req.user.id
    });

    const populatedComment = await Comment.findById(comment._id).populate("userId", "username");
    
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