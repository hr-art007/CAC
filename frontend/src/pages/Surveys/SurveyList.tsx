import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import surveyService from '../../services/surveyService'
import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function SurveyList() {
  const [surveys, setSurveys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { isChair } = useAuth()

  useEffect(() => {
    surveyService.getAll().then((r) => setSurveys(r.data)).catch(() => toast.error('Failed to load surveys')).finally(() => setLoading(false))
  }, [])

  const statusColor: Record<string, string> = { draft: 'bg-gray-100 text-gray-800', active: 'bg-green-100 text-green-800', closed: 'bg-red-100 text-red-800' }

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Surveys</h1><p className="text-gray-500">Collect member feedback</p></div>
        {isChair && <Link to="/surveys/create" className="btn-primary"><PlusIcon className="h-4 w-4 mr-1" /> New Survey</Link>}
      </div>
      <div className="card">
        <div className="space-y-3">
          {surveys.map((survey) => (
            <div key={survey.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-primary-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">{survey.title}</h3>
                    <p className="text-sm text-gray-500">{survey.questions?.length || 0} questions • {survey.responses?.length || 0} responses</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${statusColor[survey.status]}`}>{survey.status}</span>
                  <Link to={`/surveys/${survey.id}/results`} className="text-primary-600 hover:text-primary-800 text-sm font-medium">Results</Link>
                </div>
              </div>
            </div>
          ))}
          {surveys.length === 0 && <p className="text-center text-gray-400 py-8">No surveys found</p>}
        </div>
      </div>
    </div>
  )
}
