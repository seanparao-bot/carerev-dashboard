'use client'

import type { Facility } from '@/lib/supabase'

export default function Sidebar({ facilities, currentView, setCurrentView, setSelectedRegion, currentUser }: any) {
  const regions: string[] = Array.from(new Set(facilities.map((f: Facility) => f.region)))
  const isSuperAdmin = currentUser?.role === 'SuperAdmin'

  return (
    <aside className="sidebar">
      <div className="sidebar-section" style={{ padding: '8px' }}>
        <button
          onClick={() => setCurrentView('lookup')}
          style={
            currentView === 'lookup'
              ? {
                  width: '100%',
                  padding: '14px 16px',
                  background: 'linear-gradient(135deg, #1a3d5c 0%, #0f2535 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                  boxShadow: '0 4px 12px rgba(26, 61, 92, 0.2)',
                  letterSpacing: '0.3px',
                }
              : {
                  width: '100%',
                  padding: '14px 16px',
                  background: 'white',
                  color: '#666',
                  border: '1.5px solid #e8eaed',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                }
          }
          onMouseEnter={(e) => {
            if (currentView !== 'lookup') {
              e.currentTarget.style.background = '#f5f7fa'
              e.currentTarget.style.borderColor = '#d0d0d0'
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            } else {
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 61, 92, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'lookup') {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.borderColor = '#e8eaed'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)'
              e.currentTarget.style.transform = 'translateY(0)'
            } else {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 61, 92, 0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          🔍 Lookup
        </button>
      </div>

      {isSuperAdmin && (
        <div className="sidebar-section" style={{ padding: '8px' }}>
          <button
            onClick={() => setCurrentView('users')}
            style={
              currentView === 'users'
                ? {
                    width: '100%',
                    padding: '14px 16px',
                    background: 'linear-gradient(135deg, #1a3d5c 0%, #0f2535 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                    boxShadow: '0 4px 12px rgba(26, 61, 92, 0.2)',
                    letterSpacing: '0.3px',
                  }
                : {
                    width: '100%',
                    padding: '14px 16px',
                    background: 'white',
                    color: '#666',
                    border: '1.5px solid #e8eaed',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                  }
            }
            onMouseEnter={(e) => {
              if (currentView !== 'users') {
                e.currentTarget.style.background = '#f5f7fa'
                e.currentTarget.style.borderColor = '#d0d0d0'
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.06)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              } else {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 61, 92, 0.3)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== 'users') {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#e8eaed'
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)'
                e.currentTarget.style.transform = 'translateY(0)'
              } else {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 61, 92, 0.2)'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            👥 Users
          </button>
        </div>
      )}

      {regions.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-title">States</div>
          <div style={{ padding: '8px' }}>
            {regions.map((region: string) => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region)
                  setCurrentView('regional')
                }}
                style={
                  currentView === 'regional'
                    ? {
                        width: '100%',
                        padding: '12px 14px',
                        background: 'linear-gradient(135deg, #1a3d5c 0%, #0f2535 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                        boxShadow: '0 4px 12px rgba(26, 61, 92, 0.2)',
                        marginBottom: '8px',
                        letterSpacing: '0.2px',
                      }
                    : {
                        width: '100%',
                        padding: '12px 14px',
                        background: 'white',
                        color: '#666',
                        border: '1.5px solid #e8eaed',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                        marginBottom: '8px',
                      }
                }
                onMouseEnter={(e) => {
                  if (currentView !== 'regional') {
                    e.currentTarget.style.background = '#f5f7fa'
                    e.currentTarget.style.borderColor = '#d0d0d0'
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.06)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  } else {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 61, 92, 0.3)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentView !== 'regional') {
                    e.currentTarget.style.background = 'white'
                    e.currentTarget.style.borderColor = '#e8eaed'
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  } else {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 61, 92, 0.2)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
