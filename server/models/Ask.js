


// models/Quiz.js
import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],        // 4 options
  correctAnswer: Number     // index of correct option (0-3)
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