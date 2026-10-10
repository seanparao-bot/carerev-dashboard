'use client'

import { useState } from 'react'
import LoginModal from './LoginModal'

const users = {
  'admin@carerev.com': { password: 'admin123', role: 'SuperAdmin', name: 'Admin User' },
  'regional@carerev.com': { password: 'admin123', role: 'Admin', name: 'Regional Team' },
}

export default function Header({ currentUser, onLogin, onLogout }: any) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleLogin = (username: string, password: string) => {
    setLoginError('')
    const user = (users as any)[username]

    if (user && user.password === password) {
      onLogin({ ...user, email: username })
      setShowLoginModal(false)
    } else {
      setLoginError('Invalid credentials')
    }
  }

  const isGuest = currentUser?.email === 'guest'

  return (
    <>
      <div className="header">
        <div className="header-title">Main Experience Sheet & Regional Team Matrix</div>
        <div className="user-info">
          <span>{currentUser?.name}</span>
          <span className="user-badge">{currentUser?.role}</span>
          {isGuest ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="logout-btn"
            >
              Admin Login
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="logout-btn"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          error={loginError}
        />
      )}
    </>
  )
}
