



// controllers/document.controller.js
import Document from '../models/Document.js'
import Chat from '../models/Chat.js'
import Quiz from '../models/Ask.js'
import fs from 'fs'
import axios from 'axios'
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'
import { v2 as cloudinary } from 'cloudinary'

// POST /api/documents
import { processPDF } from '../python/services.js'

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const pineconeNamespace = `${req.user._id}-${Date.now()}`

    const document = await Document.create({
      userId: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: req.file.path,
      pineconeNamespace
    })

    // Process PDF asynchronously - don't block the response
    processPDF(req.file.path, pineconeNamespace).catch(err => {
      console.error('Background PDF processing failed:', err.message)
    })

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
      userId:req.user._id 
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
      userId:req.user._id 
    })

    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    // delete PDF file from uploads folder
    await cloudinary.uploader.destroy(document.filename, { resource_type: 'raw' })

    // delete related chats and quizzes
    await Chat.deleteMany({ documentId: document._id })
    await Quiz.deleteMany({ documentId: document._id })

    // TODO: delete vectors from Pinecone namespace
    // delete vectors from Pinecone namespace
    await axios.delete(`${PYTHON_SERVICE_URL}/delete-namespace`, {
      data: { namespace: document.pineconeNamespace }
    })
    // await deletePineconeNamespace(document.pineconeNamespace)

    await document.deleteOne()

    res.json({ message: 'Document deleted successfully' })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateDocumentStatus = async (req, res) => {
  try {
    const { namespace, status } = req.body
    await Document.findOneAndUpdate(
      { pineconeNamespace: namespace },
      { status }
    )
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}