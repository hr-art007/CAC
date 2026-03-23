import React, { useEffect, useState } from 'react'
import decisionService from '../../services/decisionService'
import { PlusIcon, ScaleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function DecisionList() {
  const [decisions, setDecisions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', category: '', dueDate: '' })
  const [creating, setCreating] = useState(false)
  const { isChair } = useAuth()

  const fetchDecisions = () => {
    decisionService.getAll({ status: statusFilter || undefined })
      .then((r) => setDecisions(r.data))
      .catch(() => toast.error('Failed to load decisions'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchDecisions() }, [statusFilter])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      await decisionService.create(form)
      toast.success('Decision created')
      setShowCreate(false)
      fetchDecisions()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create decision')
    } finally {
      setCreating(false)
    }
  }

  const statusColor: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-800', approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', implemented: 'bg-blue-100 text-blue-800' }
  const priorityColor: Record<string, string> = { low: 'bg-gray-100 text-gray-700', medium: 'bg-blue-100 text-blue-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' }

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Decisions</h1><p className="text-gray-500">Track CAC decisions and implementation</p></div>
        {isChair && <button onClick={() => setShowCreate(!showCreate)} className="btn-primary"><PlusIcon className="h-4 w-4 mr-1" /> New Decision</button>}
      </div>

      {showCreate && (
        <div className="card">
          <h2 className="font-semibold mb-4">Create Decision</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description *</label><textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
            </div>
            <div className="flex gap-3"><button type="submit" disabled={creating} className="btn-primary">{creating ? 'Creating...' : 'Create'}</button><button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button></div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="flex gap-3 mb-4">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="implemented">Implemented</option>
          </select>
        </div>
        <div className="space-y-3">
          {decisions.map((decision) => (
            <div key={decision.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <ScaleIcon className="h-5 w-5 text-primary-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">{decision.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{decision.description}</p>
                    {decision.category && <p className="text-xs text-gray-400 mt-1">Category: {decision.category}</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                  <span className={`badge ${statusColor[decision.status]}`}>{decision.status}</span>
                  <span className={`badge ${priorityColor[decision.priority]}`}>{decision.priority}</span>
                </div>
              </div>
            </div>
          ))}
          {decisions.length === 0 && <p className="text-center text-gray-400 py-8">No decisions found</p>}
        </div>
      </div>
    </div>
  )
}
