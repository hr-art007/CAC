import React, { useEffect, useState } from 'react'
import documentService from '../../services/documentService'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', type: 'other', accessLevel: 'members_only' })
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { isChair } = useAuth()

  const fetchDocs = async () => {
    try {
      const response = await documentService.getAll({ type: typeFilter || undefined })
      setDocuments(response.data)
    } catch { toast.error('Failed to load documents') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchDocs() }, [typeFilter])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    try {
      const formData = new FormData()
      Object.entries(uploadForm).forEach(([k, v]) => formData.append(k, v))
      if (file) formData.append('file', file)
      await documentService.upload(formData)
      toast.success('Document uploaded')
      setShowUpload(false)
      fetchDocs()
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const typeIcon: Record<string, string> = { agenda: '📋', minutes: '📝', report: '📊', policy: '📜', other: '📄' }

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Document Library</h1><p className="text-gray-500">Access and manage CAC documents</p></div>
        {isChair && <button onClick={() => setShowUpload(!showUpload)} className="btn-primary"><ArrowUpTrayIcon className="h-4 w-4 mr-1" /> Upload</button>}
      </div>

      {showUpload && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
          <form onSubmit={handleUpload} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input required value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={uploadForm.type} onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm">
                  <option value="agenda">Agenda</option><option value="minutes">Minutes</option><option value="report">Report</option><option value="policy">Policy</option><option value="other">Other</option>
                </select>
              </div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={2} value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">File</label><input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
            <div className="flex gap-3"><button type="submit" disabled={uploading} className="btn-primary">{uploading ? 'Uploading...' : 'Upload'}</button><button type="button" onClick={() => setShowUpload(false)} className="btn-secondary">Cancel</button></div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="flex gap-3 mb-4">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="">All Types</option><option value="agenda">Agenda</option><option value="minutes">Minutes</option><option value="report">Report</option><option value="policy">Policy</option><option value="other">Other</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{typeIcon[doc.type] || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                  <p className="text-xs text-gray-500 capitalize">{doc.type} • v{doc.version}</p>
                  {doc.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{doc.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">By {doc.uploader?.firstName} {doc.uploader?.lastName}</p>
                </div>
              </div>
            </div>
          ))}
          {documents.length === 0 && <div className="col-span-3 text-center text-gray-400 py-8">No documents found</div>}
        </div>
      </div>
    </div>
  )
}
