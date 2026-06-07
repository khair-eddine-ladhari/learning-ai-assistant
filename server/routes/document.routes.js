



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

const router = express.Router()

router.use(authMiddleware)   // all document routes are protected

router.post('/', upload.single('pdf'), uploadDocument)
router.get('/', getDocuments)
router.get('/:id', getDocument)
router.delete('/:id', deleteDocument)

export default router