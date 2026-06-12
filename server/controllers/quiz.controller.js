



// controllers/quiz.controller.js
import Quiz from '../models/Ask.js'
import Document from '../models/Document.js'

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

    // TEMP: hardcoded questions to test frontend
    const questions = [
      {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: "C",
        explanation: "Paris is the capital and most populous city of France."
      },
      {
        question: "Which language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        answer: "D",
        explanation: "JavaScript is the only language that runs natively in browsers."
      },
      {
        question: "What does CSS stand for?",
        options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading Simple Sheets", "Cars SUVs Sailboats"],
        answer: "B",
        explanation: "CSS stands for Cascading Style Sheets."
      }
    ]

    const quiz = await Quiz.create({
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
      _id: req.params.quizId,
      userId:req.user._id ,
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