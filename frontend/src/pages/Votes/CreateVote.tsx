import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import voteService from '../../services/voteService'
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function CreateVote() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', votingMethod: 'simple_majority', isAnonymous: false, endDate: '' })
  const [options, setOptions] = useState(['Yes', 'No'])

  const addOption = () => setOptions([...options, ''])
  const removeOption = (i: number) => setOptions(options.filter((_, idx) => idx !== i))
  const updateOption = (i: number, v: string) => setOptions(options.map((o, idx) => idx === i ? v : o))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validOptions = options.filter((o) => o.trim())
    if (validOptions.length < 2) return toast.error('At least 2 options required')
    setLoading(true)
    try {
      await voteService.create({ ...form, options: validOptions })
      toast.success('Vote created')
      navigate('/votes')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create vote')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/votes" className="text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Vote</h1>
      </div>
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Voting Method</label>
              <select value={form.votingMethod} onChange={(e) => setForm({ ...form, votingMethod: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm">
                <option value="simple_majority">Simple Majority</option><option value="two_thirds">Two-Thirds</option><option value="unanimous">Unanimous</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
          </div>
          <div className="flex items-center gap-2"><input type="checkbox" id="anon" checked={form.isAnonymous} onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })} /><label htmlFor="anon" className="text-sm text-gray-700">Anonymous voting</label></div>
          <div>
            <div className="flex items-center justify-between mb-2"><label className="block text-sm font-medium text-gray-700">Options (min 2)</label><button type="button" onClick={addOption} className="btn-secondary text-xs py-1"><PlusIcon className="h-3 w-3 mr-1" /> Add</button></div>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} className="border rounded-md px-3 py-2 flex-1 text-sm" />
                  {options.length > 2 && <button type="button" onClick={() => removeOption(i)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-4 w-4" /></button>}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2"><button type="submit" disabled={loading} className="btn-primary">{loading ? 'Creating...' : 'Create Vote'}</button><Link to="/votes" className="btn-secondary">Cancel</Link></div>
        </form>
      </div>
    </div>
  )
}
