



// controllers/document.controller.js
import Document from '../models/Document.js'
import Chat from '../models/Chat.js'
import Quiz from '../models/Ask.js'
import fs from 'fs'

// POST /api/documents
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const pineconeNamespace = `${req.userId}-${Date.now()}`

    const document = await Document.create({
      userId: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      pineconeNamespace
    })

    // TODO: call Python service to process PDF
    // await processPDF(req.file.path, pineconeNamespace)

    res.status(201).json(document)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/documents
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.id }) 
      .sort({ createdAt: -1 })
    res.json(documents)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/documents/:id
export const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.userId
    })

    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    res.json(document)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/documents/:id
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.userId
    })

    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    // delete PDF file from uploads folder
    fs.unlinkSync(`uploads/${document.filename}`)

    // delete related chats and quizzes
    await Chat.deleteMany({ documentId: document._id })
    await Quiz.deleteMany({ documentId: document._id })

    // TODO: delete vectors from Pinecone namespace
    // await deletePineconeNamespace(document.pineconeNamespace)

    await document.deleteOne()

    res.json({ message: 'Document deleted successfully' })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}