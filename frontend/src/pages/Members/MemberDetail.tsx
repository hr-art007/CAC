import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import memberService from '../../services/memberService'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function MemberDetail() {
  const { id } = useParams()
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    memberService.getById(id!).then((r) => setMember(r.data)).catch(() => toast.error('Failed to load member')).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
  if (!member) return <div className="text-center p-8 text-gray-500">Member not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/members" className="text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">{member.user?.firstName} {member.user?.lastName}</h1>
        <span className={`badge ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{member.status}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          <dl className="space-y-2">
            <div><dt className="text-sm text-gray-500">Email</dt><dd className="text-sm font-medium">{member.user?.email}</dd></div>
            <div><dt className="text-sm text-gray-500">Phone</dt><dd className="text-sm font-medium">{member.phone || '—'}</dd></div>
            <div><dt className="text-sm text-gray-500">Organization</dt><dd className="text-sm font-medium">{member.organization || '—'}</dd></div>
          </dl>
        </div>
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold">Role & Membership</h2>
          <dl className="space-y-2">
            <div><dt className="text-sm text-gray-500">Role</dt><dd className="text-sm font-medium capitalize">{member.role?.replace('_', ' ')}</dd></div>
            <div><dt className="text-sm text-gray-500">Join Date</dt><dd className="text-sm font-medium">{member.joinDate || '—'}</dd></div>
            <div><dt className="text-sm text-gray-500">Term End</dt><dd className="text-sm font-medium">{member.termEndDate || '—'}</dd></div>
          </dl>
        </div>
        {member.bio && (
          <div className="card md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Biography</h2>
            <p className="text-sm text-gray-600">{member.bio}</p>
          </div>
        )}
        {member.expertise?.length > 0 && (
          <div className="card md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Areas of Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {member.expertise.map((e: string) => <span key={e} className="badge bg-primary-100 text-primary-800">{e}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
