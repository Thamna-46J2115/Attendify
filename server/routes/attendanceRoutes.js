import express from "express";
import Session from "../models/Session.js";
import Attendance from "../models/Attendance.js";
import { protect } from "./auth.js";
const router = express.Router();
// Student enters session code
router.post("/mark-attendance", async (req, res) => {
  const { studentId, code } = req.body;
  const session = await Session.findOne({ sessionCode: code });
  if (!session)
    return res.json({ success: false, message: "Invalid session code" });
  // check if already marked
  const exists = await Attendance.findOne({
    studentId,
    sessionId: session._id,
  });
  if (exists) return res.json({ success: false, message: "Already marked" });
  const att = await Attendance.create({
    studentId,
    sessionId: session._id,
    date: new Date().toISOString().split("T")[0],
  });
  res.json({ success: true, attendance: att, session });
});
// Student History
router.get("/history", protect, async (req, res) => {
  const history = await Attendance.find({ studentId: req.user.id }).populate(
    "sessionId"
  );
  res.json(history);
});
// DELETE attendance (remove student from session history)
router.delete("/attendance/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Attendance.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance not found" });
    }
    res.json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete attendance",
    });
  }
});
export default router;
