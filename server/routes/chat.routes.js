




// routes/chat.routes.js
import express from 'express'
import {
  sendMessage,
  getChatHistory
} from '../controllers/chat.controller.js'
import rolesMiddleware from '../middleware/roles.middleware.js'
import passport from '../middleware/passport.js'
const router = express.Router()



router.post('/:documentId', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']),sendMessage)


router.get('/:documentId', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']), getChatHistory)

export default router