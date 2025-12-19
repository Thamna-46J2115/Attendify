import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import logoo from "../Images/logoo.png";
import { CiBarcode } from "react-icons/ci";
import { IoAnalyticsSharp } from "react-icons/io5";
import { MdSecurity } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

export default function Home() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Aisha-Student",
      content: "Attendify is very easy to use!",
      likes: 0,
      dislikes: 0,
    },
    {
      id: 2,
      user: "Dr.Tarek-Teacher",
      content: "Managing attendance became so fast!",
      likes: 0,
      dislikes: 0,
    },
    {
      id: 3,
      user: " Fatima-Student",
      content: "The interface is clean and simple.",
      likes: 0,
      dislikes: 0,
    },
    {
      id: 4,
      user: "Dr.Mohammed-Teacher",
      content: "Real-time tracking is amazing!",
      likes: 0,
      dislikes: 0,
    },
  ]);

  const handleLike = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleDislike = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post
      )
    );
  };

  return (
    <div className="home">
      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="hero-content">
          <img src={logoo} alt="Attendify Logo" className="hero-logo" />
          <h1 className="hero-title">
            <span className="title-blue">Atten</span>
            <span className="title-teal">dify</span>
          </h1>
          <p className="hero-subtitle">Smart Attendance Management System</p>
          <p className="hero-desc">
            Attendify modernizes attendance for universities with a simplified
            class-code check-in system. Fast, secure, and supportive for
            students, teachers, and admins with real-time tracking.
          </p>
          <Link to="/login" className="hero-btn">
            Get Started →
          </Link>
        </div>
      </section>
      <center>
        <section className="features-section">
          <h2 className="section-title">
            Why Choose <span className="title-blue">Attendify</span>?
          </h2>
          <p className="section-subtext">
            Simplifying attendance for UTAS students and staff with modern
            solutions.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Fast & Reliable</h3>
              <p>
                Attendify provides fast and reliable attendance check-ins for
                all classes.
              </p>
            </div>
            <div className="feature-card">
              <h3>Smart Insights</h3>
              <p>
                Monitor attendance percentages, daily performance, and generate
                reports easily.
              </p>
            </div>
            <div className="feature-card">
              <h3>Secure System</h3>
              <p>
                Every user has a secure account ensuring that all attendance
                data is protected.
              </p>
            </div>
            <div className="feature-card">
              <h3>User-Friendly</h3>
              <p>
                Designed with simplicity in mind, allowing students and teachers
                to use it effortlessly.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2 className="section-title">
            About <span className="title-blue">Attendify</span>
          </h2>
          <p className="section-subtext">
            Meet the team and learn the development process behind Attendify.
          </p>
          <div className="about-wrapper">
            <div className="about-card">
              <h3>Developers</h3>
              <p>
                Developed by Thamna Al-Amari & Aya Al-Taysiri, software
                Enginnerr.
              </p>
            </div>
            <div className="about-card">
              <h3>Goal</h3>
              <p>
                Our mission is to simplify attendance management while keeping
                data secure.
              </p>
            </div>
            <div className="about-card">
              <h3>Technology</h3>
              <p>
                Built with React, Redux, and Node.js for a seamless and
                interactive experience.
              </p>
            </div>
            <div className="about-card">
              <h3>Support</h3>
              <p>
                Students, teachers, and admins get real-time analytics and
                easy-to-use interfaces.
              </p>
            </div>
          </div>
        </section>

        {/* ================= POSTS SECTION ================= */}
        <section className="posts-section">
          <h2 className="section-title">Student & Teacher Feedback</h2>
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <h4 className="post-user">{post.user}</h4>
                <p className="post-content">{post.content}</p>
                <div className="post-actions">
                  <button onClick={() => handleLike(post.id)}>
                    <AiOutlineLike /> {post.likes}
                  </button>
                  <button onClick={() => handleDislike(post.id)}>
                    <AiOutlineDislike /> {post.dislikes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </center>
      {/* ================= CTA SECTION ================= */}
      <section className="cta-section">
        <h2>Ready to Begin?</h2>
        <p>
          Join hundreds of UTAS students and teachers using Attendify daily.
        </p>
      </section>
      <footer />
    </div>
  );
}
