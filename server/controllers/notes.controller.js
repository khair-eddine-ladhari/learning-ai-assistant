// controllers/note.controller.js
import Note from '../models/Note.js'
import Document from '../models/Document.js'

// POST /api/notes/:documentId
export const addNotes = async (req, res) => {
  try {
    const { text } = req.body
    const { documentId } = req.params

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Note text is required' })
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id
    })
    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    const note = await Note.create({
      userId: req.user._id,
      documentId,
      text: text.trim()
    })

    res.status(201).json(note)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/notes/:documentId
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user._id,
      documentId: req.params.documentId
    }).sort({ createdAt: -1 })

    res.json(notes)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/notes/:noteId
export const deletenotes = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.noteId,
      documentId: req.params.documentId,
      userId:req.user._id
    })

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    res.json({ message: 'Note deleted' })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}





// controller
export const updateNote = async (req, res) => {
  try {
    const { text } = req.body
    const note = await Note.findOneAndUpdate(
      { _id: req.params.noteId, documentId: req.params.documentId, userId:req.user._id  },
      { text: text.trim() },
      { new: true }
    )
    if (!note) return res.status(404).json({ message: 'Note not found' })
    res.json(note)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export default { addNotes, getNotes, deletenotes ,updateNote}