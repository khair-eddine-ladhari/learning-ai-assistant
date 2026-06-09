




// routes/chat.routes.js
import express from 'express'
import {
  sendMessage,
  getChatHistory
} from '../controllers/chat.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import passport from '../middleware/passport.js'
const router = express.Router()



router.post('/:documentId', passport.authenticate('jwt', { session: false }),
authMiddleware(['admin', 'user']),sendMessage)


router.get('/:documentId', passport.authenticate('jwt', { session: false }),
authMiddleware(['admin', 'user']), getChatHistory)

export default router