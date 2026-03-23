import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MemberList from './pages/Members/MemberList'
import MemberDetail from './pages/Members/MemberDetail'
import AddMember from './pages/Members/AddMember'
import MeetingList from './pages/Meetings/MeetingList'
import MeetingDetail from './pages/Meetings/MeetingDetail'
import CreateMeeting from './pages/Meetings/CreateMeeting'
import DocumentLibrary from './pages/Documents/DocumentLibrary'
import SurveyList from './pages/Surveys/SurveyList'
import SurveyForm from './pages/Surveys/SurveyForm'
import SurveyResults from './pages/Surveys/SurveyResults'
import VoteList from './pages/Votes/VoteList'
import VoteDetail from './pages/Votes/VoteDetail'
import CreateVote from './pages/Votes/CreateVote'
import DecisionList from './pages/Decisions/DecisionList'
import ReportsPage from './pages/Reports/ReportsPage'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

const AppRoutes = () => {
  const { isAuthenticated } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="members" element={<MemberList />} />
        <Route path="members/add" element={<AddMember />} />
        <Route path="members/:id" element={<MemberDetail />} />
        <Route path="meetings" element={<MeetingList />} />
        <Route path="meetings/create" element={<CreateMeeting />} />
        <Route path="meetings/:id" element={<MeetingDetail />} />
        <Route path="documents" element={<DocumentLibrary />} />
        <Route path="surveys" element={<SurveyList />} />
        <Route path="surveys/create" element={<SurveyForm />} />
        <Route path="surveys/:id/results" element={<SurveyResults />} />
        <Route path="votes" element={<VoteList />} />
        <Route path="votes/create" element={<CreateVote />} />
        <Route path="votes/:id" element={<VoteDetail />} />
        <Route path="decisions" element={<DecisionList />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </Router>
    </AuthProvider>
  )
}
