// models/Document.js
import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  pineconeNamespace: {
    type: String,
    required: true,
    unique: true
  },
  status: {
  type: String,
  enum: ['pending', 'ready', 'failed'],
  default: 'pending'
}
}, { timestamps: true })

export default mongoose.model('Document', documentSchema)