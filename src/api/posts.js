import axios from "axios";

const API_URL = "http://localhost:5000/posts";

// Fetch paginated posts
export const fetchPosts = async (page = 1, pageSize = 5) => {
  const response = await axios.get(API_URL, {
    params: { page, pageSize },
  });
  return response.data;
};

// Create a new post
export const createPost = async (newPost) => {
  const response = await axios.post(API_URL, newPost);
  return response.data;
};

// Share a post
export const sharePost = async (postId) => {
  const response = await axios.post(`${API_URL}/${postId}/share`);
  return response.data;
};

// Add a comment to a post
export const addComment = async (postId, comment) => {
  const response = await axios.post(`${API_URL}/${postId}/comments`, { comment });
  return response.data;
};
