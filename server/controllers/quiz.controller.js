



// controllers/quiz.controller.js
import Quiz from '../models/Ask.js'
import Document from '../models/Document.js'
import axios from 'axios'
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'
// POST /api/quiz/:documentId


export const generateQuiz = async (req, res) => {
  try {
    const { documentId } = req.params

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id
    })
    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    const ragRes = await axios.post(`${PYTHON_SERVICE_URL}/quiz`, {
      namespace: document.pineconeNamespace
    })

    const questions = ragRes.data.questions

    await Quiz.create({
      userId: req.user._id,
      documentId,
      questions
    })

    res.status(201).json({ questions })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/quiz/:documentId/:quizId
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      userId: req.user._id,
      documentId: req.params.documentId
    })

    if (!quiz) return res.json({ questions: [] })

    res.json({ questions: quiz.questions })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}