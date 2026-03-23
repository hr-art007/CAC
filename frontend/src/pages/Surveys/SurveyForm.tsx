import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import surveyService from '../../services/surveyService'
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Question { id: string; text: string; type: string; options?: string[] }

export default function SurveyForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', isAnonymous: false, status: 'draft', startDate: '', endDate: '' })
  const [questions, setQuestions] = useState<Question[]>([{ id: '1', text: '', type: 'text', options: [] }])

  const addQuestion = () => setQuestions([...questions, { id: Date.now().toString(), text: '', type: 'text', options: [] }])
  const removeQuestion = (id: string) => setQuestions(questions.filter((q) => q.id !== id))
  const updateQuestion = (id: string, updates: Partial<Question>) => setQuestions(questions.map((q) => q.id === id ? { ...q, ...updates } : q))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await surveyService.create({ ...form, questions })
      toast.success('Survey created')
      navigate('/surveys')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create survey')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/surveys" className="text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Create Survey</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-semibold">Survey Details</h2>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="border rounded-md px-3 py-2 w-full text-sm" /></div>
          </div>
          <div className="flex items-center gap-2"><input type="checkbox" id="anon" checked={form.isAnonymous} onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })} /><label htmlFor="anon" className="text-sm text-gray-700">Allow anonymous responses</label></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border rounded-md px-3 py-2 text-sm">
              <option value="draft">Draft</option><option value="active">Active</option>
            </select>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between"><h2 className="font-semibold">Questions</h2><button type="button" onClick={addQuestion} className="btn-secondary text-xs py-1.5"><PlusIcon className="h-3 w-3 mr-1" /> Add Question</button></div>
          {questions.map((q, i) => (
            <div key={q.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Question {i + 1}</span>
                {questions.length > 1 && <button type="button" onClick={() => removeQuestion(q.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-4 w-4" /></button>}
              </div>
              <input required value={q.text} onChange={(e) => updateQuestion(q.id, { text: e.target.value })} placeholder="Question text..." className="border rounded-md px-3 py-2 w-full text-sm" />
              <select value={q.type} onChange={(e) => updateQuestion(q.id, { type: e.target.value })} className="border rounded-md px-3 py-2 text-sm">
                <option value="text">Text Answer</option><option value="rating">Rating (1-5)</option><option value="multiple_choice">Multiple Choice</option><option value="yes_no">Yes/No</option>
              </select>
            </div>
          ))}
        </div>

        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading ? 'Creating...' : 'Create Survey'}</button><Link to="/surveys" className="btn-secondary">Cancel</Link></div>
      </form>
    </div>
  )
}
