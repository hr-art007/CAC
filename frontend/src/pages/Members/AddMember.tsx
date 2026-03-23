import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import memberService from '../../services/memberService'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function AddMember() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', role: 'member', phone: '', organization: '', bio: '', joinDate: '', termEndDate: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await memberService.create(form)
      toast.success('Member added successfully')
      navigate('/members')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/members" className="text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Member</h1>
      </div>
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input type="text" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm">
                <option value="member">Member</option>
                <option value="chair">Chair</option>
                <option value="vice_chair">Vice Chair</option>
                <option value="staff">Staff</option>
                <option value="advisor">Advisor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
            <input type="text" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
              <input type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term End Date</label>
              <input type="date" value={form.termEndDate} onChange={(e) => setForm({ ...form, termEndDate: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Adding...' : 'Add Member'}</button>
            <Link to="/members" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
