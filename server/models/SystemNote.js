import mongoose from 'mongoose';

const systemNoteSchema = new mongoose.Schema({
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const SystemNote = mongoose.model('SystemNote', systemNoteSchema);
export default SystemNote;
