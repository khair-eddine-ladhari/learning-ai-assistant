



// routes/document.routes.js
import express from 'express'
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  updateDocumentStatus
} from '../controllers/document.controller.js'
import rolesMiddleware from '../middleware/roles.middleware.js'
import upload from '../middleware/upload.middleware.js'
import passport from '../middleware/passport.js'
const router = express.Router()

 // all document routes are protected

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  rolesMiddleware(["admin", "user"]),
  upload.single("pdf"),
  uploadDocument
);

router.get('/', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']), getDocuments)

router.get('/:id', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']),getDocument)

router.delete('/:id' , passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']),deleteDocument)


router.post('/status', updateDocumentStatus)

export default router