'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { verifyPassword } from '@/lib/auth-utils'
import LoginModal from './LoginModal'

export default function Header({ currentUser, onLogin, onLogout }: any) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleLogin = async (username: string, password: string) => {
    console.log('=== LOGIN ATTEMPT ===', username)
    setLoginError('')

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', username)
        .single()

      if (error || !data) {
        console.error('User not found:', error)
        setLoginError('Invalid credentials')
        return
      }

      console.log('User found:', data.email)
      console.log('Password hash exists:', !!data.password_hash)

      const isPasswordValid = await verifyPassword(password, data.password_hash)
      console.log('Password valid:', isPasswordValid)

      if (isPasswordValid && data.is_active) {
        onLogin({
          id: data.id,
          email: data.email,
          role: data.role,
          name: data.role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin',
        })
        setShowLoginModal(false)
      } else {
        setLoginError('Invalid credentials or account inactive')
      }
    } catch (err) {
      console.error('Login error:', err)
      setLoginError('Login failed')
    }
  }

  const isGuest = currentUser?.email === 'guest'

  return (
    <>
      <div className="header">
        <div className="header-title">Facility Management Dashboard</div>
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
