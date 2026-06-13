


// models/Quiz.js
import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,        // "A", "B", "C", or "D" — matches Python output
  explanation: String    // optional but useful
})

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  questions: [questionSchema]
}, { timestamps: true })

export default mongoose.model('Quiz', quizSchema)