'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Facility } from '@/lib/supabase'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import LookupView from '@/components/LookupView'
import RegionalView from '@/components/RegionalView'
import UsersManagement from '@/components/UsersManagement'

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'lookup' | 'regional' | 'users'>('lookup')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  useEffect(() => {
    initializeDashboard()
    subscribeToFacilities()
  }, [])

  const initializeDashboard = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')

      if (error) throw error
      setFacilities(data || [])
      setCurrentUser({ role: 'User', name: 'Guest', email: 'guest' })
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToFacilities = () => {
    const channel = supabase
      .channel('public:facilities')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'facilities' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setFacilities(prev => [...prev, payload.new as Facility])
          } else if (payload.eventType === 'UPDATE') {
            setFacilities(prev =>
              prev.map((f) => (f.id === payload.new.id ? payload.new as Facility : f))
            )
          } else if (payload.eventType === 'DELETE') {
            setFacilities(prev => prev.filter((f) => f.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }

  const handleLogin = (user: any) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser({ role: 'User', name: 'Guest', email: 'guest' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#fafbfc' }}>
      <Header
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          facilities={facilities}
          currentView={currentView}
          setCurrentView={setCurrentView}
          setSelectedRegion={setSelectedRegion}
          currentUser={currentUser}
        />
        <div className="view-container">
          {currentView === 'lookup' ? (
            <LookupView
              facilities={facilities}
              currentUser={currentUser}
              setCurrentView={setCurrentView}
              setSelectedRegion={setSelectedRegion}
            />
          ) : currentView === 'users' ? (
            <UsersManagement />
          ) : (
            <RegionalView
              facilities={facilities}
              region={selectedRegion || ''}
              currentUser={currentUser}
              setCurrentView={setCurrentView}
            />
          )}
        </div>
      </div>
    </div>
  )
}
