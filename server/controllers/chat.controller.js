import Chat from '../models/Chat.js'
import Document from '../models/Document.js'
import axios from 'axios'

const MAX_HISTORY = 10
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'

// POST /api/chat/:documentId
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body
    const { documentId } = req.params

    // verify document belongs to user
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id
    })
    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    // get or create chat for this document
    let chat = await Chat.findOne({ userId: req.user._id, documentId })
    if (!chat) {
      chat = await Chat.create({ userId: req.user._id, documentId, messages: [] })
    }

    // push user message
    chat.messages.push({ role: 'user', content: message })

    let response
    try {
      const ragRes = await axios.post(`${PYTHON_SERVICE_URL}/chat`, {
        query: message,
        history: chat.messages.slice(-MAX_HISTORY).map(m => ({ role: m.role, content: m.content }))
      })
      response = ragRes.data.response
    } catch (ragErr) {
      console.error('AI service error:', ragErr.message)
      response = 'Sorry, the AI service is currently unavailable.'
    }

    // push assistant message
    chat.messages.push({ role: 'assistant', content: response })
    await chat.save()

    res.json({ response })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/chat/:documentId
export const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      userId: req.user._id,
      documentId: req.params.documentId
    })

    if (!chat) {
      return res.json({ messages: [] })
    }

    res.json({ messages: chat.messages })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}