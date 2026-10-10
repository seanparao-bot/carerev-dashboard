'use client'

import { useState, useMemo } from 'react'
import type { Facility } from '@/lib/supabase'

// Fixed type safety for states, systems, and specialties arrays

export default function LookupView({ facilities, currentUser, setCurrentView, setSelectedRegion }: any) {
  const [filterState, setFilterState] = useState('')
  const [filterSystem, setFilterSystem] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('')
  const [filterRecruiting, setFilterRecruiting] = useState('')
  const [filterOnboarding, setFilterOnboarding] = useState('')

  const states: string[] = useMemo(() => Array.from(new Set(facilities.map((f: Facility) => f.region))), [facilities])
  const systems: string[] = useMemo(() => Array.from(new Set(facilities.map((f: Facility) => f.health_system))), [facilities])
  const specialties: string[] = useMemo(() => Array.from(new Set(facilities.map((f: Facility) => f.specialty))), [facilities])

  const filtered = useMemo(() => {
    return facilities.filter((f: Facility) => {
      if (filterState && f.region !== filterState) return false
      if (filterSystem && f.health_system !== filterSystem) return false
      if (filterSpecialty && f.specialty !== filterSpecialty) return false
      if (filterRecruiting !== '' && f.recruiting !== (filterRecruiting === 'true')) return false
      if (filterOnboarding !== '' && f.onboarding !== (filterOnboarding === 'true')) return false
      return true
    })
  }, [facilities, filterState, filterSystem, filterSpecialty, filterRecruiting, filterOnboarding])

  return (
    <div className="view active" style={{ padding: '28px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1a3d5c', marginBottom: '8px', letterSpacing: '-0.5px' }}>Facility Lookup</h2>
        <p style={{ fontSize: '13px', color: '#999' }}>Search and filter healthcare facilities across regions</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>State</label>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          >
            <option value="">All States</option>
            {states.map((state: string) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Health System</label>
          <select
            value={filterSystem}
            onChange={(e) => setFilterSystem(e.target.value)}
          >
            <option value="">All Systems</option>
            {systems.map((sys: string) => (
              <option key={sys} value={sys}>{sys}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Specialty</label>
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specialties.map((spec: string) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Recruiting</label>
          <select
            value={filterRecruiting}
            onChange={(e) => setFilterRecruiting(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Onboarding</label>
          <select
            value={filterOnboarding}
            onChange={(e) => setFilterOnboarding(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
        {filtered.length} facilities found
      </div>

      <div className="summary-table">
        <table>
          <thead>
            <tr>
              <th>Facility Name</th>
              <th>Health System</th>
              <th>Specialty</th>
              <th>Recruiting</th>
              <th>Onboarding</th>
              <th>Required Experience</th>
              <th>Orientation Dates</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
                  No facilities match your criteria
                </td>
              </tr>
            ) : (
              filtered.map((facility: Facility) => (
                <tr key={facility.id}>
                  <td><strong>{facility.name}</strong></td>
                  <td>{facility.health_system || ''}</td>
                  <td>{facility.specialty}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`checkbox-icon ${facility.recruiting ? 'checked' : 'unchecked'}`}>
                      {facility.recruiting ? '✓' : '✕'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`checkbox-icon ${facility.onboarding ? 'checked' : 'unchecked'}`}>
                      {facility.onboarding ? '✓' : '✕'}
                    </span>
                  </td>
                  <td>{facility.required_experience}</td>
                  <td>{facility.orientation_dates || ''}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedRegion(facility.region)
                        setCurrentView('regional')
                      }}
                      style={{
                        color: '#1a3d5c',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '13px',
                        background: 'none',
                        border: 'none',
                        padding: '0',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      View Region
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
