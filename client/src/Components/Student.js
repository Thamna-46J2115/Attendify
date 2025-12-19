import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAttendance } from "../Features/attendanceSlice";
import axios from "axios";
import "../App.css";

export default function Student({ user }) {
  const dispatch = useDispatch();

  // Attendance history from Redux
  const attendance = useSelector((state) => state.attendance.history) || [];

  const [showModal, setShowModal] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch attendance history on load
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchAttendance(user.token));
    }
  }, [user?.token, dispatch]);

  // Confirm attendance
  const handleConfirmCode = async () => {
    if (!sessionCode.trim()) return;
    if (!user?.token) return;

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:3001/student/attend",
        { code: sessionCode },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      alert(res.data.message);

      // Refresh attendance history
      dispatch(fetchAttendance(user.token));

      setSessionCode("");
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error confirming attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete attendance
  const handleDeleteAttendance = async (attendanceId) => {
    if (!window.confirm("Are you sure you want to delete this attendance?"))
      return;

    try {
      await axios.delete(
        `http://localhost:3001/student/attendance/${attendanceId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Refresh attendance history
      dispatch(fetchAttendance(user.token));
    } catch (error) {
      alert("Failed to delete attendance");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Student Dashboard</h1>

      {/* Stats */}
      <div className="student-cards">
        <div className="student-card">
          <p className="card-label">Present</p>
          <h2 className="card-value green">
            {attendance.filter((h) => h.status === "Present").length}
          </h2>
        </div>

        <div className="student-card">
          <p className="card-label">Absent</p>
          <h2 className="card-value red">
            {attendance.filter((h) => h.status === "Absent").length}
          </h2>
        </div>

        <div className="student-card">
          <p className="card-label">Total Sessions</p>
          <h2 className="card-value">{attendance.length}</h2>
        </div>
      </div>

      {/* Enter Code */}
      <div className="qr-section">
        <div className="qr-left">
          <h2>Enter Session Code</h2>
          <p>
            Type the session code provided by your teacher to record attendance.
          </p>
          <button className="qr-btn" onClick={() => setShowModal(true)}>
            Enter Code
          </button>
        </div>
      </div>

      {/* Attendance History */}
      <div className="history-section">
        <h2>Attendance History</h2>

        <div className="history-table">
          <div className="history-header">
            <p>Session</p>
            <p>Status</p>
            <p>Date</p>
            <p>Action</p>
          </div>

          {attendance.length === 0 && (
            <p style={{ padding: "20px" }}>No attendance records found.</p>
          )}

          {attendance.map((item) => (
            <div className="history-row" key={item._id}>
              <p>{item.sessionId?.name || "Session"}</p>

              <p className={item.status === "Present" ? "green" : "red"}>
                {item.status}
              </p>

              <p>{item.date}</p>

              <center>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteAttendance(item._id)}
                >
                  Delete
                </button>
              </center>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="scan-modal">
            <h2>Enter Session Code</h2>

            <input
              type="text"
              className="manual-input"
              placeholder="Enter the code…"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
            />

            <button
              className="confirm-btn"
              onClick={handleConfirmCode}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm Attendance"}
            </button>

            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
