// src/Components/Post.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { likePost, dislikePost } from "../Features/PostSlice";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import "../App.css";

export default function Post() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);

  return (
    <div className="posts-page">
      <h2 className="section-title"></h2>
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h4>{post.user}</h4>
            <p>{post.content}</p>
            <div className="post-actions">
              <button onClick={() => dispatch(likePost(post.id))}>
                <AiOutlineLike /> {post.likes}
              </button>
              <button onClick={() => dispatch(dislikePost(post.id))}>
                <AiOutlineDislike /> {post.dislikes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
