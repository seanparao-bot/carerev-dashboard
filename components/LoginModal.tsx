'use client'

import { useState } from 'react'

export default function LoginModal({ onClose, onLogin, error }: any) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onLogin(username, password)
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: '0',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '50',
      backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        padding: '32px',
        width: '100%',
        maxWidth: '420px',
        animation: 'slideUp 0.3s ease',
      }}>
        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#1a3d5c',
        }}>Admin Login</h2>

        <p style={{
          fontSize: '13px',
          color: '#666',
          marginBottom: '24px',
        }}>Enter your credentials to access admin features</p>

        {error && (
          <div style={{
            marginBottom: '16px',
            padding: '12px 14px',
            background: '#ffebee',
            border: '1px solid #ef5350',
            color: '#d32f2f',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#333',
            }}>
              Email or Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#1a3d5c'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26, 61, 92, 0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#ddd'
                e.currentTarget.style.boxShadow = 'none'
              }}
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#333',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#1a3d5c'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26, 61, 92, 0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#ddd'
                e.currentTarget.style.boxShadow = 'none'
              }}
              required
            />
          </div>

          <div style={{
            padding: '14px',
            background: '#f0fffe',
            borderRadius: '8px',
            border: '1px solid #d4e6f1',
            fontSize: '12px',
            color: '#0f3d5c',
            lineHeight: '1.6',
          }}>
            <strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Demo Credentials:</strong>
            SuperAdmin: admin@company.com / admin123<br />
            Admin: user@company.com / (check Users page for password)
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                background: 'white',
                color: '#333',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8f9fa'
                e.currentTarget.style.borderColor = '#bbb'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: loading ? '#999' : 'linear-gradient(135deg, #1a3d5c 0%, #0f2535 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                boxShadow: '0 4px 12px rgba(26, 61, 92, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 61, 92, 0.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 61, 92, 0.2)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
