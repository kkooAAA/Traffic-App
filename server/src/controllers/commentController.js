import Comment from "../models/Comment.js";

export const createComment = async (
  req,
  res
) => {
  try {
    const comment = await Comment.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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