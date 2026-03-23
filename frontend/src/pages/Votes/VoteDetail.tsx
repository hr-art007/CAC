import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import voteService from '../../services/voteService'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function VoteDetail() {
  const { id } = useParams()
  const [vote, setVote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedChoice, setSelectedChoice] = useState('')
  const [casting, setCasting] = useState(false)
  const { isChair } = useAuth()

  const fetchVote = () => voteService.getById(id!).then((r) => setVote(r.data)).catch(() => toast.error('Failed to load vote')).finally(() => setLoading(false))

  useEffect(() => { fetchVote() }, [id])

  const handleCastVote = async () => {
    if (!selectedChoice) return toast.error('Please select an option')
    setCasting(true)
    try {
      await voteService.cast(id!, { choice: selectedChoice })
      toast.success('Vote cast successfully')
      fetchVote()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cast vote')
    } finally {
      setCasting(false)
    }
  }

  const handleClose = async () => {
    try {
      await voteService.close(id!)
      toast.success('Vote closed')
      fetchVote()
    } catch { toast.error('Failed to close vote') }
  }

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
  if (!vote) return <div className="text-center p-8 text-gray-500">Vote not found</div>

  const totalVotes = Object.values(vote.results || {}).reduce((a: any, b: any) => a + b, 0) as number

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/votes" className="text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">{vote.title}</h1>
          <span className={`badge ${vote.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{vote.status}</span>
        </div>
        {isChair && vote.status === 'open' && <button onClick={handleClose} className="btn-danger">Close Vote</button>}
      </div>

      {vote.description && <div className="card"><p className="text-sm text-gray-600">{vote.description}</p></div>}

      {vote.status === 'open' && (
        <div className="card">
          <h2 className="font-semibold mb-4">Cast Your Vote</h2>
          <div className="space-y-2 mb-4">
            {vote.options?.map((opt: string) => (
              <label key={opt} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="choice" value={opt} checked={selectedChoice === opt} onChange={() => setSelectedChoice(opt)} className="text-primary-600" />
                <span className="text-sm font-medium">{opt}</span>
              </label>
            ))}
          </div>
          <button onClick={handleCastVote} disabled={casting || !selectedChoice} className="btn-primary">{casting ? 'Casting...' : 'Submit Vote'}</button>
        </div>
      )}

      {Object.keys(vote.results || {}).length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-4">Results ({totalVotes} votes)</h2>
          <div className="space-y-3">
            {vote.options?.map((opt: string) => {
              const count = (vote.results[opt] || 0) as number
              const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
              return (
                <div key={opt}>
                  <div className="flex justify-between text-sm mb-1"><span className="font-medium">{opt}</span><span className="text-gray-500">{count} votes ({pct}%)</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div></div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
