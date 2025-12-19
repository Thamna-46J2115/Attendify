import express from "express";
import Session from "../models/Session.js";
const router = express.Router();
// Create New Session
router.post("/add-session", async (req, res) => {
  const { teacherId, name, time, room, date } = req.body;
  // generate code like X92KD
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 5; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  const session = await Session.create({
    teacherId,
    sessionName: name,
    sessionTime: time,
    sessionRoom: room,
    sessionDate: date,
    sessionCode: code,
  });
  res.json({ success: true, session });
});
//  Fetch Teacher Sessions
router.get("/:teacherId/sessions", async (req, res) => {
  const { teacherId } = req.params;
  const sessions = await Session.find({ teacherId });
  res.json(sessions);
});

export default router;
