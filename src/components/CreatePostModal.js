import React, { useState } from "react";
import Modal from "react-modal";
import { useMutation, useQueryClient } from "react-query";
import { createPost } from "../api/posts";
import "./CreatePostModal.css";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      onClose();
    },
  });

  const handleSubmit = () => {
    if (content.trim()) {
      mutation.mutate({
        id: Date.now(),
        user: "You",
        avatar: "https://via.placeholder.com/50",
        content,
        likes: 0,
        comments: [],
        shares: 0,
      });
      setContent("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Create Post</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows="5"
      />
      <div className="modal-actions">
        <button className="btn-primary" onClick={handleSubmit}>
          Post
        </button>
        <button className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default CreatePostModal;
