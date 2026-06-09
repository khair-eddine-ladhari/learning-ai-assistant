



// routes/document.routes.js
import express from 'express'
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument
} from '../controllers/document.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import upload from '../middleware/upload.middleware.js'
import passport from '../middleware/passport.js'
const router = express.Router()

 // all document routes are protected

router.post('/', upload.single('pdf'), passport.authenticate('jwt', { session: false }),
authMiddleware(['admin', 'user']), uploadDocument)

router.get('/', passport.authenticate('jwt', { session: false }),
authMiddleware(['admin', 'user']), getDocuments)

router.get('/:id', passport.authenticate('jwt', { session: false }),
authMiddleware(['admin', 'user']),getDocument)

router.delete('/:id' , passport.authenticate('jwt', { session: false }),
authMiddleware(['admin', 'user']),deleteDocument)

export default router