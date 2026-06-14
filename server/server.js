import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import connectDB from './config/db.js'

import authRoutes from './routes/auth.routes.js'
import documentRoutes from './routes/document.routes.js'
import chatRoutes from './routes/chat.routes.js'
import quizRoutes from './routes/quiz.routes.js'
import notesRoutes from './routes/notes.routes.js'

import fs from 'fs'
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads')

dotenv.config()
connectDB()

const app = express()

// ── Security headers
app.use(helmet())

// ── CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))

// ── Request size limit


app.use(express.json({ limit: '10kb' }))

// ── NoSQL injection protection


// ── General rate limit (all routes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { message: 'Too many requests, please try again later.' }
})
app.use(generalLimiter)

// ── Strict rate limit (auth routes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: 'Too many login attempts, please try again later.' }
})

// ── Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/notes', notesRoutes)

// ── Hide error details in production
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  res.status(status).json({ message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))