import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import meetingService from '../../services/meetingService'
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function MeetingList() {
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const { isChair } = useAuth()

  useEffect(() => {
    meetingService.getAll({ status: statusFilter || undefined })
      .then((r) => setMeetings(r.data))
      .catch(() => toast.error('Failed to load meetings'))
      .finally(() => setLoading(false))
  }, [statusFilter])

  const statusColor: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-500">Schedule and manage CAC meetings</p>
        </div>
        {isChair && <Link to="/meetings/create" className="btn-primary"><PlusIcon className="h-4 w-4 mr-1" /> Schedule Meeting</Link>}
      </div>

      <div className="card">
        <div className="flex gap-3 mb-4">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <Link key={meeting.id} to={`/meetings/${meeting.id}`} className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-blue-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(meeting.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(meeting.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-sm text-gray-400">{meeting.location}</p>
                  </div>
                </div>
                <span className={`badge ${statusColor[meeting.status] || 'bg-gray-100 text-gray-800'} capitalize`}>{meeting.status?.replace('_', ' ')}</span>
              </div>
            </Link>
          ))}
          {meetings.length === 0 && <p className="text-center text-gray-400 py-8">No meetings found</p>}
        </div>
      </div>
    </div>
  )
}
