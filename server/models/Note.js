

// models/Note.js
import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  text: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model('Note', noteSchema)