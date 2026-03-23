import React, { useEffect, useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import memberService from '../../services/memberService'
import meetingService from '../../services/meetingService'
import decisionService from '../../services/decisionService'
import voteService from '../../services/voteService'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

export default function ReportsPage() {
  const [memberStats, setMemberStats] = useState<any>(null)
  const [meetingStats, setMeetingStats] = useState<any>(null)
  const [decisionStats, setDecisionStats] = useState<any>(null)
  const [voteStats, setVoteStats] = useState<any>(null)

  useEffect(() => {
    Promise.all([memberService.getStats(), meetingService.getStats(), decisionService.getStats(), voteService.getStats()])
      .then(([m, mt, d, v]) => { setMemberStats(m.data); setMeetingStats(mt.data); setDecisionStats(d.data); setVoteStats(v.data) })
      .catch(() => {})
  }, [])

  const memberData = {
    labels: ['Active', 'Inactive', 'Alumni'],
    datasets: [{ data: [memberStats?.active ?? 0, memberStats?.inactive ?? 0, memberStats?.alumni ?? 0], backgroundColor: ['#10b981', '#ef4444', '#8b5cf6'] }],
  }

  const meetingData = {
    labels: ['Scheduled', 'Completed', 'Cancelled'],
    datasets: [{ label: 'Meetings', data: [meetingStats?.scheduled ?? 0, meetingStats?.completed ?? 0, meetingStats?.cancelled ?? 0], backgroundColor: ['#3b82f6', '#10b981', '#ef4444'] }],
  }

  const decisionData = {
    labels: ['Pending', 'Approved', 'Rejected', 'Implemented'],
    datasets: [{ label: 'Decisions', data: [decisionStats?.pending ?? 0, decisionStats?.approved ?? 0, decisionStats?.rejected ?? 0, decisionStats?.implemented ?? 0], backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#6366f1'] }],
  }

  const kpis = [
    { label: 'Total Members', value: memberStats?.total ?? '—', sub: `${memberStats?.active ?? 0} active` },
    { label: 'Total Meetings', value: meetingStats?.total ?? '—', sub: `${meetingStats?.completed ?? 0} completed` },
    { label: 'Total Decisions', value: decisionStats?.total ?? '—', sub: `${decisionStats?.implemented ?? 0} implemented` },
    { label: 'Total Votes', value: voteStats?.total ?? '—', sub: `${voteStats?.open ?? 0} open` },
  ]

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1><p className="text-gray-500">Key metrics and performance indicators</p></div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card text-center">
            <p className="text-3xl font-bold text-primary-600">{kpi.value}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{kpi.label}</p>
            <p className="text-xs text-gray-400">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Member Distribution</h2>
          <Doughnut data={memberData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>
        <div className="card">
          <h2 className="font-semibold mb-4">Meeting Status</h2>
          <Bar data={meetingData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
        </div>
        <div className="card">
          <h2 className="font-semibold mb-4">Decision Tracking</h2>
          <Bar data={decisionData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
        </div>
      </div>

      {/* Summary Table */}
      <div className="card">
        <h2 className="font-semibold mb-4">Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>{['Metric', 'Total', 'Active/Open', 'Completed/Closed'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="px-4 py-3 text-sm font-medium">Members</td><td className="px-4 py-3 text-sm">{memberStats?.total ?? '—'}</td><td className="px-4 py-3 text-sm">{memberStats?.active ?? '—'}</td><td className="px-4 py-3 text-sm">{memberStats?.alumni ?? '—'} alumni</td></tr>
              <tr><td className="px-4 py-3 text-sm font-medium">Meetings</td><td className="px-4 py-3 text-sm">{meetingStats?.total ?? '—'}</td><td className="px-4 py-3 text-sm">{meetingStats?.scheduled ?? '—'}</td><td className="px-4 py-3 text-sm">{meetingStats?.completed ?? '—'}</td></tr>
              <tr><td className="px-4 py-3 text-sm font-medium">Votes</td><td className="px-4 py-3 text-sm">{voteStats?.total ?? '—'}</td><td className="px-4 py-3 text-sm">{voteStats?.open ?? '—'}</td><td className="px-4 py-3 text-sm">{voteStats?.closed ?? '—'}</td></tr>
              <tr><td className="px-4 py-3 text-sm font-medium">Decisions</td><td className="px-4 py-3 text-sm">{decisionStats?.total ?? '—'}</td><td className="px-4 py-3 text-sm">{decisionStats?.pending ?? '—'} pending</td><td className="px-4 py-3 text-sm">{decisionStats?.implemented ?? '—'} implemented</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
