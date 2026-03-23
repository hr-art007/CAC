import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import meetingService from '../../services/meetingService'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function CreateMeeting() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', scheduledDate: '', endTime: '', location: '', meetingType: 'regular', meetingLink: '', agenda: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const agenda = form.agenda ? form.agenda.split('\n').filter(Boolean) : []
      await meetingService.create({ ...form, agenda })
      toast.success('Meeting scheduled successfully')
      navigate('/meetings')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create meeting')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/meetings" className="text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Schedule New Meeting</h1>
      </div>
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title *</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time *</label>
              <input type="datetime-local" required value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
              <select value={form.meetingType} onChange={(e) => setForm({ ...form, meetingType: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm">
                <option value="regular">Regular</option>
                <option value="special">Special</option>
                <option value="emergency">Emergency</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link (for virtual)</label>
            <input type="url" value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agenda Items (one per line)</label>
            <textarea rows={5} value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} placeholder="1. Call to order&#10;2. Approval of minutes&#10;3. ..." className="border rounded-md px-3 py-2 w-full text-sm" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Scheduling...' : 'Schedule Meeting'}</button>
            <Link to="/meetings" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
