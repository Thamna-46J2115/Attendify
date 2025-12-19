import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSessions,
  createSession,
  deleteSession,
  updateSession,
} from "../Features/teacherSlice";
import "../App.css";

export default function Teacher() {
  const dispatch = useDispatch();

  const { sessions = [], isLoading } = useSelector(
    (state) => state.teacher || {}
  );

  const safeSessions = Array.isArray(sessions)
    ? sessions.filter(Boolean)
    : [];

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const [showModal, setShowModal] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionRoom, setSessionRoom] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchSessions(token));
    }
  }, [dispatch, token]);

  const resetFields = () => {
    setSessionName("");
    setSessionTime("");
    setSessionRoom("");
    setSessionDate("");
    setEditingId(null);
  };

  const handleCreate = async () => {
    if (!sessionName || !sessionTime || !sessionRoom || !sessionDate) {
      showToast("Please fill all fields", "error");
      return;
    }

    await dispatch(
      createSession({
        token,
        sessionData: {
          name: sessionName,
          time: sessionTime,
          room: sessionRoom,
          date: sessionDate,
        },
      })
    );

    await dispatch(fetchSessions(token));

    showToast("Session created successfully");
    setShowModal(false);
    resetFields();
  };

  const handleUpdate = async () => {
    await dispatch(
      updateSession({
        token,
        id: editingId,
        updatedData: {
          name: sessionName,
          time: sessionTime,
          room: sessionRoom,
          date: sessionDate,
        },
      })
    );

    await dispatch(fetchSessions(token));

    showToast("Session updated successfully");
    setShowModal(false);
    resetFields();
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    await dispatch(deleteSession({ token, id }));
    await dispatch(fetchSessions(token));

    showToast("Session deleted successfully");
  };

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Teacher Dashboard</h1>

      <div className="student-cards">
        <div className="student-card">
          <p className="card-label">Total Sessions</p>
          <h2 className="card-value">{safeSessions.length}</h2>
        </div>

        <div className="student-card">
          <p className="card-label">Today's Students</p>
          <h2 className="card-value green">
            {safeSessions.reduce(
              (acc, s) => acc + (s.students?.length || 0),
              0
            )}
          </h2>
        </div>
      </div>

      <div className="create-session-card">
        <h2>Create Session</h2>
        <button className="qr-btn" onClick={() => setShowModal(true)}>
          + Add Session
        </button>
      </div>

      <h2>Your Sessions</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="session-list">
          {safeSessions.length === 0 ? (
            <p>No sessions created yet.</p>
          ) : (
            safeSessions.map((s) => (
              <div className="session-item" key={s._id}>
                <div>
                  <h3>{s.name}</h3>
                  <p>
                    {s.time} — Room {s.room}
                  </p>
                </div>

                <div className="session-time">Date: {s.date}</div>

                <div className="session-students">
                  Students: {s.students?.length || 0}
                </div>

                <div className="session-actions">
                  <button
                    className="update-btn"
                    onClick={() => {
                      setShowModal(true);
                      setEditingId(s._id);
                      setSessionName(s.name);
                      setSessionTime(s.time);
                      setSessionRoom(s.room);
                      setSessionDate(s.date);
                    }}
                  >
                    Update
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteSession(s._id)}
                  >
                    Delete
                  </button>
                </div>

                <div className="session-code-box">{s.code}</div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{editingId ? "Update Session" : "Create Session"}</h2>

            <input
              type="text"
              className="modal-input"
              placeholder="Session Name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />

            <input
              type="time"
              className="modal-input"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
            />

            <input
              type="text"
              className="modal-input"
              placeholder="Room Number"
              value={sessionRoom}
              onChange={(e) => setSessionRoom(e.target.value)}
            />

            <input
              type="date"
              className="modal-input"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => {
                  setShowModal(false);
                  resetFields();
                }}
              >
                Cancel
              </button>

              <button
                className="modal-btn confirm"
                onClick={editingId ? handleUpdate : handleCreate}
              >
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
