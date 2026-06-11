'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { getTranslations } from '@/lib/translations'
import Image from "next/image";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  
  // Extract locale from pathname: /en/student → en
  const locale = pathname.split('/')[1] || 'en'
  const t = getTranslations(locale)

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(/^\/(en|fr|ar)/, `/${newLocale}`)
    window.location.href = newPath
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    window.location.href = '/login'
  }

  const navItems = [
    { label: (t.navigation.dashboard as string) || 'Dashboard', icon: '📊' },
    { label: (t.navigation.grades as string) || 'Grades', icon: '📈' },
    { label: (t.navigation.profile as string) || 'Profile', icon: '👤' },
  ]

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-br from-blue-900 to-blue-600  text-white transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        {isOpen && <a className="text-2xl font-bold text-blue-400">
            <Image
                    src="/images/tilmidLogo.png"
                    alt="TILMID Logo"
                    width={330}
                    height={80}
                    priority
                  /></a>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white transition text-lg cursor-pointer"
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2">
        {navItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-white hover:text-black transition cursor-pointer"
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </div>
        ))}
      </nav>

      {/* Language Switcher */}
      <div className="absolute bottom-24 left-0 right-0 p-4 border-t border-gray-700">
        {isOpen && <p className="text-xs text-gray-500 mb-2">🌍 Language</p>}
        <div className={`grid ${isOpen ? 'grid-cols-3' : 'grid-cols-1'} gap-2`}>
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`px-2 py-1 rounded text-sm font-semibold transition cursor-pointer ${
              locale === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('fr')}
            className={`px-2 py-1 rounded text-sm font-semibold transition cursor-pointer ${
              locale === 'fr'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('ar')}
            className={`px-2 py-1 rounded text-sm font-semibold transition cursor-pointer ${
              locale === 'ar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            AR
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-semibold text-sm cursor-pointer"
        >
          {isOpen ? `🚪 ${(t.common.logout as string) || 'Logout'}` : '🚪'}
        </button>
      </div>
    </aside>
  )
}