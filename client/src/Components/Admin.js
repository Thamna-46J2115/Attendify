import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminStats,
  fetchRecentSessions,
  fetchNewUsers,
  fetchSystemNotes,
} from "../Features/adminSlice";
import "../App.css";
import { IoAnalytics } from "react-icons/io5";

export default function Admin() {
  const dispatch = useDispatch();
  const { stats, recentSessions, newUsers, systemNotes, loading, error } =
    useSelector((state) => state.admin);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in as admin to view this page.");
      return;
    }

    dispatch(fetchAdminStats());
    dispatch(fetchRecentSessions());
    dispatch(fetchNewUsers());
    dispatch(fetchSystemNotes());
  }, [dispatch]);

  if (loading) return <h2 className="dashboard-title">Loading...</h2>;

  if (error)
    return (
      <h2 className="dashboard-title">
        Error: {error.message || JSON.stringify(error)}
      </h2>
    );

  if (!stats) return <h2 className="dashboard-title">No Data</h2>;

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* TOP CARDS */}
      <div className="student-cards">
        <div className="student-card">
          <p className="card-label">Total Students</p>
          <h2 className="card-value">{stats.students}</h2>
        </div>
        <div className="student-card">
          <p className="card-label">Total Teachers</p>
          <h2 className="card-value">{stats.teachers}</h2>
        </div>
        <div className="student-card">
          <p className="card-label">Total Sessions</p>
          <h2 className="card-value">{stats.sessions}</h2>
        </div>
        <div className="student-card">
          <p className="card-label">Attendance Today</p>
          <h2 className="card-value">{stats.attendanceToday}</h2>
        </div>
      </div>

      {/* Weekly Attendance Chart */}
      <h2 className="panel-title" style={{ marginTop: "40px" }}>
        Weekly Attendance
      </h2>

      {/* Panels Grid */}
      <div className="admin-panels">
        {/* Recent Sessions */}
        <div className="panel">
          <h3 className="panel-title">Recent Sessions</h3>
          <div className="panel-list">
            {recentSessions?.map((s, index) => (
              <div className="list-item" key={index}>
                <span>
                  <strong>{s.name}</strong> — {s.time}
                </span>
                <span style={{ color: "#0b4f9f" }}>{s.teacherId?.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* New Users */}
        <div className="panel">
          <h3 className="panel-title">New Users</h3>
          <div className="panel-list">
            {newUsers?.map((u, index) => (
              <div className="list-item" key={index}>
                <span>{u.name}</span>
                <span style={{ color: "#3b82f6", fontWeight: "600" }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Notes */}
        <div className="panel">
          <h3 className="panel-title">System Notes</h3>
          {systemNotes && systemNotes.length > 0 ? (
            systemNotes.map((note, index) => (
              <p key={index} className="risk-note">
                • {note.message}
              </p>
            ))
          ) : (
            <p className="risk-note">• No system notes</p>
          )}
        </div>
      </div>
    </div>
  );
}
