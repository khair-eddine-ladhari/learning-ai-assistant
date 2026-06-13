

import axios from 'axios'

const PYTHON_URL = process.env.PYTHON_SERVICE_URL // e.g. http://localhost:8000

export const processPDF = async (fileUrl, pineconeNamespace) => {
  try {
    await axios.post(`${PYTHON_URL}/process`, {
      file_url: fileUrl,
      namespace: pineconeNamespace,
    })
  } catch (err) {
    console.error('processPDF failed:', err.message)
    throw err
  }
}