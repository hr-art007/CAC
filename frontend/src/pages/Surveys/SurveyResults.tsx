import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import surveyService from '../../services/surveyService'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function SurveyResults() {
  const { id } = useParams()
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    surveyService.getResults(id!).then((r) => setResults(r.data)).catch(() => toast.error('Failed to load results')).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
  if (!results) return <div className="text-center p-8 text-gray-500">Results not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/surveys" className="text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">{results.survey?.title} - Results</h1>
      </div>
      <div className="card"><p className="text-lg font-semibold">{results.responseCount} Total Responses</p></div>
      {Object.entries(results.analytics || {}).map(([qId, data]: [string, any]) => (
        <div key={qId} className="card">
          <h3 className="font-semibold mb-2">{data.question}</h3>
          <p className="text-sm text-gray-500 mb-3">{data.totalResponses} responses</p>
          <div className="space-y-1">
            {data.answers.slice(0, 5).map((a: any, i: number) => <p key={`${qId}-answer-${i}`} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{typeof a === 'object' ? JSON.stringify(a) : String(a)}</p>)}
          </div>
        </div>
      ))}
    </div>
  )
}
