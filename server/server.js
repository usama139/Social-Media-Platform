const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to the posts.json file
const postsFilePath = path.join(__dirname, "posts.json");

// Helper function to read posts
const readPosts = () => {
  try {
    const data = fs.readFileSync(postsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Route to fetch paginated posts
app.get("/posts", (req, res) => {
  const posts = readPosts();
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 5;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // If we've reached the end, start over
  const paginatedPosts = posts.slice(startIndex, endIndex);
  const hasMore = endIndex < posts.length || page > Math.ceil(posts.length / pageSize);

  res.json({ posts: paginatedPosts.length ? paginatedPosts : posts.slice(0, pageSize), hasMore });
});

// Route to create a new post
app.post("/posts", (req, res) => {
  const newPost = req.body;
  const posts = readPosts();
  posts.unshift(newPost); // Add the new post to the beginning
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
  res.status(201).json(newPost);
});

// Route to share a post
app.post("/posts/:id/share", (req, res) => {
  const { id } = req.params;
  const posts = readPosts();

  const postIndex = posts.findIndex((post) => post.id === parseInt(id));
  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  posts[postIndex].shares += 1;

  const originalPost = posts[postIndex];
  const sharedPost = {
    ...originalPost,
    id: Date.now(),
    user: "Shared by You",
    shares: 0,
    comments: [],
  };

  posts.unshift(sharedPost);
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
  res.status(200).json(sharedPost);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
