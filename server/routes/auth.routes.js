import express from 'express'
import { register, login, getMe } from '../controllers/auth.controller.js'
import passport from '../middleware/passport.js' // ✅ use passport instead

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', passport.authenticate('jwt', { session: false }), getMe) // ✅ use passport
export default router