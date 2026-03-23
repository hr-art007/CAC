import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  HomeIcon, UsersIcon, CalendarIcon, DocumentTextIcon,
  ClipboardDocumentListIcon, CheckCircleIcon, ScaleIcon, ChartBarIcon, XMarkIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Members', href: '/members', icon: UsersIcon },
  { name: 'Meetings', href: '/meetings', icon: CalendarIcon },
  { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
  { name: 'Surveys', href: '/surveys', icon: ClipboardDocumentListIcon },
  { name: 'Votes', href: '/votes', icon: CheckCircleIcon },
  { name: 'Decisions', href: '/decisions', icon: ScaleIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
]

interface SidebarProps { open: boolean; setOpen: (v: boolean) => void }

export default function Sidebar({ open, setOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setOpen(false)} />
          <div className="relative flex flex-col w-72 max-w-xs bg-primary-800 h-full">
            <SidebarContent setOpen={setOpen} mobile />
          </div>
        </div>
      )}
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-primary-800">
          <SidebarContent setOpen={setOpen} />
        </div>
      </div>
    </>
  )
}

function SidebarContent({ setOpen, mobile }: { setOpen: (v: boolean) => void; mobile?: boolean }) {
  return (
    <div className="flex flex-col flex-1 h-0 overflow-y-auto">
      <div className="flex items-center justify-between flex-shrink-0 px-4 py-5">
        <div>
          <h1 className="text-white text-xl font-bold">CAC Portal</h1>
          <p className="text-primary-200 text-xs">Healthcare Advisory</p>
        </div>
        {mobile && (
          <button onClick={() => setOpen(false)} className="text-primary-200 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive ? 'bg-primary-900 text-white' : 'text-primary-100 hover:bg-primary-700 hover:text-white'
              }`
            }
            onClick={() => mobile && setOpen(false)}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
