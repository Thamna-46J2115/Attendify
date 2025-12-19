import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import User from "./models/User.js";
import Session from "./models/Session.js";
import Attendance from "./models/Attendance.js";
import SystemNote from "./models/SystemNote.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const { PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_CLUSTER, JWT_SECRET } =
  process.env;

// ================= MULTER SETUP =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ================= EXPRESS SETUP =================
const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static("public/uploads"));

// ================= MONGODB =================
const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// ================= AUTH MIDDLEWARE =================
const authenticateRole = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Authentication required" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== requiredRole)
        return res
          .status(403)
          .json({ message: "Forbidden: insufficient rights" });

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

// ================= TEST =================
app.get("/", (req, res) => res.send("Attendify Server Running"));

// ================= AUTH =================
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role: role || "student",
    });

    res.status(201).json({ message: "User registered", newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
});

// ================= PROFILE =================
app.put(
  "/user/update-profile/:id",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const { name, password } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) return res.status(404).json({ message: "User not found" });

      if (name) user.name = name;
      if (password) user.password = await bcrypt.hash(password, 10);

      if (req.file) {
        user.profilePic = `uploads/${req.file.filename}`;
      }

      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Profile update failed" });
    }
  }
);

app.get("/user/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ================= TEACHER =================
app.post(
  "/teacher/create-session",
  authenticateRole("teacher"),
  async (req, res) => {
    const { name, time, room, date } = req.body;
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();

    const session = await Session.create({
      name,
      time,
      room,
      date,
      code,
      teacherId: req.user.id,
    });

    res.status(201).json(session);
  }
);

app.get("/teacher/sessions", authenticateRole("teacher"), async (req, res) => {
  const sessions = await Session.find({ teacherId: req.user.id }).lean();

  const sessionIds = sessions.map((s) => s._id);

  const attendanceCounts = await Attendance.aggregate([
    { $match: { sessionId: { $in: sessionIds } } },
    { $group: { _id: "$sessionId", count: { $sum: 1 } } },
  ]);

  const countMap = {};
  attendanceCounts.forEach((a) => {
    countMap[a._id.toString()] = a.count;
  });

  const result = sessions.map((s) => ({
    ...s,
    students: Array(countMap[s._id.toString()] || 0),
  }));

  res.json(result);
});


// ================= STUDENT =================
app.post("/student/attend", authenticateRole("student"), async (req, res) => {
  const { code } = req.body;
  const session = await Session.findOne({ code });

  if (!session)
    return res.status(404).json({ message: "Invalid session code" });

  const existing = await Attendance.findOne({
    studentId: req.user.id,
    sessionId: session._id,
  });

  if (existing)
    return res.status(400).json({ message: "Attendance already recorded" });

  const attendance = await Attendance.create({
    studentId: req.user.id,
    sessionId: session._id,
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  res.json({ message: "Attendance confirmed", attendance });
});

app.get(
  "/student/attendance",
  authenticateRole("student"),
  async (req, res) => {
    const attendance = await Attendance.find({
      studentId: req.user.id,
    })
      .populate("sessionId", "name")
      .sort({ date: -1 });

    res.json(attendance);
  }
);

app.delete(
  "/student/attendance/:id",
  authenticateRole("student"),
  async (req, res) => {
    await Attendance.findOneAndDelete({
      _id: req.params.id,
      studentId: req.user.id,
    });
    res.json({ message: "Attendance deleted" });
  }
);

// ================= ADMIN =================
app.get("/admin/stats", authenticateRole("admin"), async (req, res) => {
  const students = await User.countDocuments({ role: "student" });
  const teachers = await User.countDocuments({ role: "teacher" });
  const sessions = await Session.countDocuments();
  res.json({ students, teachers, sessions });
});

app.get(
  "/admin/system-notes",
  authenticateRole("admin"),
  async (req, res) => {
    const notes = await SystemNote.find().sort({ createdAt: -1 }).limit(10);
    res.json(notes);
  }
);

app.get(
  "/admin/new-users",
  authenticateRole("admin"),
  async (req, res) => {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt");
    res.json(users);
  }
);

app.get(
  "/admin/recent-sessions",
  authenticateRole("admin"),
  async (req, res) => {
    const sessions = await Session.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("teacherId", "name");
    res.json(sessions);
  }
);

app.delete(
  "/sessions/:id",
  authenticateRole("teacher"),
  async (req, res) => {
    await Session.findOneAndDelete({
      _id: req.params.id,
      teacherId: req.user.id,
    });
    res.json({ message: "Deleted" });
  }
);

app.put(
  "/sessions/:id",
  authenticateRole("teacher"),
  async (req, res) => {
    const updated = await Session.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  }
);

// ================= ROUTES =================
app.use("/api/auth", authRoutes);

// ================= START =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "client", "build", "index.html")
  );
});
