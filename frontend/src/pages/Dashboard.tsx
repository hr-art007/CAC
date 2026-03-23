import React, { useEffect, useState } from 'react'
import { UsersIcon, CalendarIcon, ScaleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import memberService from '../services/memberService'
import meetingService from '../services/meetingService'
import decisionService from '../services/decisionService'
import voteService from '../services/voteService'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

interface Stats { total: number; active?: number; inactive?: number; alumni?: number; scheduled?: number; completed?: number; cancelled?: number; pending?: number; approved?: number; rejected?: number; implemented?: number; open?: number; closed?: number }

export default function Dashboard() {
  const { user } = useAuth()
  const [memberStats, setMemberStats] = useState<Stats | null>(null)
  const [meetingStats, setMeetingStats] = useState<Stats | null>(null)
  const [decisionStats, setDecisionStats] = useState<Stats | null>(null)
  const [voteStats, setVoteStats] = useState<Stats | null>(null)

  useEffect(() => {
    Promise.all([
      memberService.getStats(),
      meetingService.getStats(),
      decisionService.getStats(),
      voteService.getStats(),
    ]).then(([m, mt, d, v]) => {
      setMemberStats(m.data)
      setMeetingStats(mt.data)
      setDecisionStats(d.data)
      setVoteStats(v.data)
    }).catch(() => {})
  }, [])

  const statCards = [
    { title: 'Total Members', value: memberStats?.total ?? '—', subtitle: `${memberStats?.active ?? 0} active`, icon: UsersIcon, color: 'bg-blue-500', link: '/members' },
    { title: 'Total Meetings', value: meetingStats?.total ?? '—', subtitle: `${meetingStats?.scheduled ?? 0} scheduled`, icon: CalendarIcon, color: 'bg-green-500', link: '/meetings' },
    { title: 'Decisions', value: decisionStats?.total ?? '—', subtitle: `${decisionStats?.pending ?? 0} pending`, icon: ScaleIcon, color: 'bg-purple-500', link: '/decisions' },
    { title: 'Active Votes', value: voteStats?.open ?? '—', subtitle: `${voteStats?.total ?? 0} total`, icon: CheckCircleIcon, color: 'bg-orange-500', link: '/votes' },
  ]

  const memberChartData = {
    labels: ['Active', 'Inactive', 'Alumni'],
    datasets: [{ data: [memberStats?.active ?? 0, memberStats?.inactive ?? 0, memberStats?.alumni ?? 0], backgroundColor: ['#3b82f6', '#ef4444', '#8b5cf6'], borderWidth: 0 }],
  }

  const decisionChartData = {
    labels: ['Pending', 'Approved', 'Rejected', 'Implemented'],
    datasets: [{
      label: 'Decisions',
      data: [decisionStats?.pending ?? 0, decisionStats?.approved ?? 0, decisionStats?.rejected ?? 0, decisionStats?.implemented ?? 0],
      backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#6366f1'],
    }],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-500">Here's an overview of your CAC activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link key={card.title} to={card.link} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-400">{card.subtitle}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Member Status Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={memberChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Decision Status Overview</h2>
          <div className="h-64">
            <Bar data={decisionChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/meetings/create" className="btn-primary justify-center text-center text-xs py-3">Schedule Meeting</Link>
          <Link to="/members/add" className="btn-secondary justify-center text-center text-xs py-3">Add Member</Link>
          <Link to="/votes/create" className="btn-secondary justify-center text-center text-xs py-3">Create Vote</Link>
          <Link to="/surveys/create" className="btn-secondary justify-center text-center text-xs py-3">New Survey</Link>
        </div>
      </div>
    </div>
  )
}
