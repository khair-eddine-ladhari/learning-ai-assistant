




// routes/quiz.routes.js
import express from 'express'
import {
  generateQuiz,
  getQuizzes,
  getQuiz
} from '../controllers/quiz.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware)

router.post('/:documentId', generateQuiz)
router.get('/:documentId', getQuizzes)
router.get('/:documentId/:quizId', getQuiz)

export default router