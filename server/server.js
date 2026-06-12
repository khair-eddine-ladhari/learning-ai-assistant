




// server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
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
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Must be BEFORE all routes

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/notes', notesRoutes)








const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))