




// routes/chat.routes.js
import express from 'express'
import {
  sendMessage,
  getChatHistory
} from '../controllers/chat.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware)

router.post('/:documentId', sendMessage)
router.get('/:documentId', getChatHistory)

export default router