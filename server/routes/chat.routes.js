




// routes/chat.routes.js
import express from 'express'
import {
  sendMessage,
  getChatHistory,
  getSummary ,
  saveSummary
} from '../controllers/chat.controller.js'
import rolesMiddleware from '../middleware/roles.middleware.js'
import passport from '../middleware/passport.js'
const router = express.Router()



router.post('/:documentId', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']),sendMessage)


router.get('/:documentId', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']), getChatHistory)


router.get('/:documentId/summary', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']), getSummary)

router.put('/:documentId/summary', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']), saveSummary)

export default router