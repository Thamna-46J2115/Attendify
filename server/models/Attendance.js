import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  status: { type: String, default: 'Present' },
  date: { type: String },
});

export default mongoose.model('Attendance', attendanceSchema);
