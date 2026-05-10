import { useState, useEffect } from "react";
import api from "../services/api";

function CommentSection({ incidentId, socket }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        fetchComments();

        if (socket) {
            const handleNewComment = (comment) => {
                if (comment.incidentId === incidentId) {
                    setComments((prev) => {
                        if (prev.some(c => c._id === comment._id)) return prev;
                        return [...prev, comment];
                    });
                }
            };

            const handleUpdateComment = (updatedComment) => {
                if (updatedComment.incidentId === incidentId) {
                    setComments((prev) => 
                        prev.map(c => c._id === updatedComment._id ? updatedComment : c)
                    );
                }
            };

            const handleDeleteComment = ({ id, incidentId: commentIncidentId }) => {
                if (commentIncidentId === incidentId) {
                    setComments((prev) => prev.filter(c => c._id !== id));
                }
            };

            socket.on("newComment", handleNewComment);
            socket.on("updateComment", handleUpdateComment);
            socket.on("deleteComment", handleDeleteComment);

            return () => {
                socket.off("newComment", handleNewComment);
                socket.off("updateComment", handleUpdateComment);
                socket.off("deleteComment", handleDeleteComment);
            };
        }
    }, [incidentId, socket]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/comments/${incidentId}`);
            setComments(response.data);
        } catch (err) {
            console.error("Failed to fetch comments", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await api.post("/comments", {
                incidentId,
                content: newComment,
            });
            setComments(prev => {
                if (prev.some(c => c._id === response.data._id)) return prev;
                return [...prev, response.data];
            });
            setNewComment("");
        } catch (err) {
            alert("Failed to post comment: " + (err.response?.data?.message || err.message));
        }
    };

    const handleUpdate = async (id) => {
        try {
            const response = await api.patch(`/comments/${id}`, {
                content: editContent,
            });
            setComments(prev => prev.map(c => c._id === id ? response.data : c));
            setEditingComment(null);
        } catch (err) {
            alert("Failed to update comment");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await api.delete(`/comments/${id}`);
            setComments(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            alert("Failed to delete comment");
        }
    };

    return (
        <div className="mt-4 border-t border-zinc-200 pt-3">
            <h3 className="text-sm font-bold mb-2">Comments</h3>
            
            <div className="max-h-48 overflow-y-auto mb-3 space-y-2 pr-1 custom-scrollbar">
                {loading && comments.length === 0 ? (
                    <p className="text-xs text-zinc-500">Loading...</p>
                ) : comments.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="bg-zinc-50 p-2 rounded text-xs group">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-zinc-700">
                                    {comment.userId?.username || "Unknown"}
                                    {comment.userId?._id === currentUserId && (
                                        <span className="ml-1 text-[9px] text-red-500 font-normal">(You)</span>
                                    )}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-zinc-400">
                                        {new Date(comment.createdAt).toLocaleTimeString()}
                                    </span>
                                    {comment.userId?._id === currentUserId && (
                                        <div className="hidden group-hover:flex gap-1">
                                            <button 
                                                onClick={() => {
                                                    setEditingComment(comment._id);
                                                    setEditContent(comment.content);
                                                }}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(comment._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {editingComment === comment._id ? (
                                <div className="flex flex-col gap-1 mt-1">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full p-1 border rounded text-red-500"
                                        rows="2"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button 
                                            onClick={() => setEditingComment(null)}
                                            className="text-[10px] bg-zinc-200 px-2 py-0.5 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => handleUpdate(comment._id)}
                                            className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-zinc-600 break-words">{comment.content}</p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {token ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className={`text-xs p-2 border rounded bg-white transition-colors duration-200 ${
                            newComment ? 'text-red-500 font-medium' : 'text-zinc-800'
                        }`}
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className={`text-xs px-4 py-1.5 rounded-lg font-bold transition ${
                                !newComment.trim() 
                                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
                                : 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
                            }`}
                        >
                            Post Comment
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-[10px] text-zinc-500 text-center italic">
                    Please login to comment
                </p>
            )}
        </div>
    );
}

export default CommentSection;
