import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import meetingService from '../../services/meetingService'
import { ArrowLeftIcon, MapPinIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function MeetingDetail() {
  const { id } = useParams()
  const [meeting, setMeeting] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    meetingService.getById(id!).then((r) => setMeeting(r.data)).catch(() => toast.error('Failed to load meeting')).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
  if (!meeting) return <div className="text-center p-8 text-gray-500">Meeting not found</div>

  const statusColor: Record<string, string> = { scheduled: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/meetings" className="text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">{meeting.title}</h1>
        <span className={`badge ${statusColor[meeting.status] || 'bg-gray-100 text-gray-800'}`}>{meeting.status}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ClockIcon className="h-4 w-4" />
          {new Date(meeting.scheduledDate).toLocaleString()}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPinIcon className="h-4 w-4" />{meeting.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserGroupIcon className="h-4 w-4" />{meeting.attendances?.length || 0} attendees
        </div>
      </div>
      {meeting.description && <div className="card"><h2 className="font-semibold mb-2">Description</h2><p className="text-sm text-gray-600">{meeting.description}</p></div>}
      {meeting.agenda?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-3">Agenda</h2>
          <ol className="space-y-2">
            {meeting.agenda.map((item: any, i: number) => <li key={`agenda-${i}-${typeof item === 'string' ? item.slice(0, 20) : i}`} className="flex gap-2 text-sm"><span className="font-medium text-primary-600">{i + 1}.</span><span>{typeof item === 'string' ? item : item.title || JSON.stringify(item)}</span></li>)}
          </ol>
        </div>
      )}
      {meeting.minutes && (
        <div className="card">
          <h2 className="font-semibold mb-2">Meeting Minutes</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{meeting.minutes}</p>
        </div>
      )}
      {meeting.attendances?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-3">Attendance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {meeting.attendances.map((a: any) => (
              <div key={a.id} className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${a.status === 'present' ? 'bg-green-500' : a.status === 'excused' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                <span>{a.member?.user?.firstName} {a.member?.user?.lastName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
