import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import voteService from '../../services/voteService'
import { PlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function VoteList() {
  const [votes, setVotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { isChair } = useAuth()

  useEffect(() => {
    voteService.getAll().then((r) => setVotes(r.data)).catch(() => toast.error('Failed to load votes')).finally(() => setLoading(false))
  }, [])

  const statusColor: Record<string, string> = { open: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-800', cancelled: 'bg-red-100 text-red-800' }

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Votes</h1><p className="text-gray-500">CAC voting items and decisions</p></div>
        {isChair && <Link to="/votes/create" className="btn-primary"><PlusIcon className="h-4 w-4 mr-1" /> Create Vote</Link>}
      </div>
      <div className="card">
        <div className="space-y-3">
          {votes.map((vote) => (
            <Link key={vote.id} to={`/votes/${vote.id}`} className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-blue-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-primary-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">{vote.title}</h3>
                    <p className="text-sm text-gray-500">{vote.options?.length || 0} options • {vote.records?.length || 0} votes cast</p>
                  </div>
                </div>
                <span className={`badge ${statusColor[vote.status]}`}>{vote.status}</span>
              </div>
            </Link>
          ))}
          {votes.length === 0 && <p className="text-center text-gray-400 py-8">No votes found</p>}
        </div>
      </div>
    </div>
  )
}
