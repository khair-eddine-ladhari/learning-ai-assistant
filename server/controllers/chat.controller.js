

// controllers/chat.controller.js
import Chat from '../models/Chat.js'
import Document from '../models/Document.js'

const MAX_HISTORY = 10

// POST /api/chat/:documentId
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body
    const { documentId } = req.params

    // verify document belongs to user
    const document = await Document.findOne({
      _id: documentId,
      userId: req.userId
    })
    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    // get or create chat for this document
    let chat = await Chat.findOne({ userId: req.userId, documentId })
    if (!chat) {
      chat = await Chat.create({ userId: req.userId, documentId, messages: [] })
    }

    // push user message
    chat.messages.push({ role: 'user', content: message })

    // TODO: call Python service for RAG response
    // const response = await ragChat(message, document.pineconeNamespace, chat.messages.slice(-MAX_HISTORY))
    const response = 'Python AI service not connected yet'

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
      userId: req.userId,
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