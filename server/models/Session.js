import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true },
  room: { type: String, required: true },
  date: { type: String, required: true },
  code: { type: String, required: true },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
});

export default mongoose.model('Session', sessionSchema);
