




// routes/quiz.routes.js
import express from 'express'
import {
  generateQuiz,
  getQuizzes,
  getQuiz
} from '../controllers/quiz.controller.js'
import rolesMiddleware from '../middleware/roles.middleware.js'
import passport from '../middleware/passport.js'
const router = express.Router()



router.post('/:documentId', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']), generateQuiz)
router.get('/:documentId', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']), getQuizzes)
router.get('/:documentId/:quizId', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']), getQuiz)

export default router