import React, { useState } from "react";
import Feed from "./components/Feed";
import CreatePostModal from "./components/CreatePostModal";
import "./App.css";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="App">
      <header className="header">
        <h1>Social Media Dashboard</h1>
        <button className="create-post-btn" onClick={() => setIsModalOpen(true)}>
          Create Post
        </button>
      </header>
      <Feed />
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default App;
