import React, { useState } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { addComment, sharePost } from "../api/posts";
import "./Post.css";

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments || []);
  const [shares, setShares] = useState(post.shares || 0);
  const [newComment, setNewComment] = useState("");

  const queryClient = useQueryClient();

  const addCommentMutation = useMutation(({ postId, comment }) => addComment(postId, comment), {
    onSuccess: () => queryClient.invalidateQueries("posts"),
  });

  const sharePostMutation = useMutation((postId) => sharePost(postId), {
    onSuccess: () => {
      setShares((prev) => prev + 1);
      queryClient.invalidateQueries("posts");
    },
  });

  const handleLike = () => setLikes((prev) => prev + 1);
  const handleComment = () => {
    if (newComment.trim()) {
      const comment = { text: newComment, date: new Date().toISOString() };
      addCommentMutation.mutate({ postId: post.id, comment });
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    }
  };
  const handleShare = () => sharePostMutation.mutate(post.id);

  return (
    <div className="post">
      <div className="post-header">
        <h4>{post.user}</h4>
      </div>
      <p>{post.content}</p>
      <div className="post-actions">
        <button onClick={handleLike}>
          <FaThumbsUp /> Like ({likes})
        </button>
        <button>
          <FaComment /> Comment ({comments.length})
        </button>
        <button onClick={handleShare}>
          <FaShare /> Share ({shares})
        </button>
      </div>
      <div className="comments-section">
        {comments.map((comment, index) => (
          <div key={index}>{comment.text}</div>
        ))}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleComment}>Add Comment</button>
      </div>
    </div>
  );
};

export default Post;
