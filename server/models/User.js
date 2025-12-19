import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' },
});

export default mongoose.model('User', userSchema);
