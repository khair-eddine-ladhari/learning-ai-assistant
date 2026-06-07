



// controllers/quiz.controller.js
import Quiz from '../models/Ask.js'
import Document from '../models/Document.js'

// POST /api/quiz/:documentId
export const generateQuiz = async (req, res) => {
  try {
    const { documentId } = req.params

    const document = await Document.findOne({
      _id: documentId,
      userId: req.userId
    })
    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    // TODO: call Python service to generate quiz
    // const questions = await generateQuizFromPDF(document.pineconeNamespace)
    const questions = []

    const quiz = await Quiz.create({
      userId: req.userId,
      documentId,
      questions
    })

    res.status(201).json(quiz)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/quiz/:documentId
export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      userId: req.userId,
      documentId: req.params.documentId
    }).sort({ createdAt: -1 })

    res.json(quizzes)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/quiz/:documentId/:quizId
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.quizId,
      userId: req.userId,
      documentId: req.params.documentId
    })

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    res.json(quiz)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}