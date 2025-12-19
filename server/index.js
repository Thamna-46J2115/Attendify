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

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ================= EXPRESS =================
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

// ================= DATABASE =================
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
        return res.status(403).json({ message: "Forbidden" });

      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("Attendify Server Running");
});

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
    } catch {
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
  const sessions = await Session.find({ teacherId: req.user.id });
  res.json(sessions);
});

// ================= STUDENT =================
app.post("/student/attend", authenticateRole("student"), async (req, res) => {
  const { code } = req.body;
  const session = await Session.findOne({ code });
  if (!session)
    return res.status(404).json({ message: "Invalid session code" });

  const exists = await Attendance.findOne({
    studentId: req.user.id,
    sessionId: session._id,
  });

  if (exists)
    return res.status(400).json({ message: "Already attended" });

  const attendance = await Attendance.create({
    studentId: req.user.id,
    sessionId: session._id,
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  res.json(attendance);
});

// ================= ADMIN =================
app.get("/admin/stats", authenticateRole("admin"), async (req, res) => {
  res.json({
    students: await User.countDocuments({ role: "student" }),
    teachers: await User.countDocuments({ role: "teacher" }),
    sessions: await Session.countDocuments(),
  });
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);

// ================= FRONTEND =================
app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "client", "build", "index.html")
  );
});

// ================= START =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

