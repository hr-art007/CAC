import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import memberService from '../../services/memberService'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function MemberList() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { isChair } = useAuth()

  const fetchMembers = async () => {
    try {
      const response = await memberService.getAll({ status: statusFilter || undefined })
      setMembers(response.data)
    } catch {
      toast.error('Failed to load members')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMembers() }, [statusFilter])

  const filtered = members.filter((m) =>
    `${m.user?.firstName} ${m.user?.lastName} ${m.user?.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    alumni: 'bg-gray-100 text-gray-800',
  }

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-500">Manage CAC member profiles</p>
        </div>
        {isChair && (
          <Link to="/members/add" className="btn-primary">
            <PlusIcon className="h-4 w-4 mr-1" /> Add Member
          </Link>
        )}
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 border rounded-md px-3 py-2 w-full"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="alumni">Alumni</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {['Name', 'Email', 'Role', 'Organization', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.user?.firstName} {member.user?.lastName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{member.user?.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 capitalize">{member.role?.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{member.organization || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusColor[member.status] || 'bg-gray-100 text-gray-800'}`}>{member.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/members/${member.id}`} className="text-primary-600 hover:text-primary-800 text-sm font-medium">View</Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No members found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
