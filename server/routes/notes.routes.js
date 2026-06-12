






// routes/document.routes.js
import express from 'express'
import {
    addNotes,
    getNotes,
    deletenotes,
    updateNote
} from '../controllers/notes.controller.js'

import rolesMiddleware from '../middleware/roles.middleware.js'

import passport from '../middleware/passport.js'
const router = express.Router()

 // all document routes are protected

router.post(
  "/:documentId",
  passport.authenticate("jwt", { session: false }),
  rolesMiddleware(["admin", "user"]),
  addNotes


);

router.get('/:documentId', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']), getNotes)

router.delete('/:documentId/:noteId', passport.authenticate('jwt', { session: false }),
rolesMiddleware(['admin', 'user']), deletenotes)

router.put('/:documentId/:noteId', passport.authenticate('jwt', { session: false }),
  rolesMiddleware(['admin', 'user']), updateNote)



export default router