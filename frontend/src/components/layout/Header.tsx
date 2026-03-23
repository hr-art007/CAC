import React from 'react'
import { Menu } from '@headlessui/react'
import { Bars3Icon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface HeaderProps { onMenuClick: () => void }

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-700">
          <Bars3Icon className="h-6 w-6" />
        </button>
        <div className="flex-1 lg:flex-none" />
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{user?.firstName} {user?.lastName}</span>
          <span className="badge bg-primary-100 text-primary-800 capitalize">{user?.role?.replace('_', ' ')}</span>
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center text-gray-500 hover:text-gray-700">
              <UserCircleIcon className="h-8 w-8" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                  >
                    <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </header>
  )
}
