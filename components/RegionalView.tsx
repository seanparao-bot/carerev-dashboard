'use client'

import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { Facility } from '@/lib/supabase'
import EditModal from './EditModal'

export default function RegionalView({ facilities, region, currentUser, setCurrentView }: any) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingCell, setEditingCell] = useState<any>(null)
  const [editValue, setEditValue] = useState('')

  const regionFacilities = useMemo(
    () => facilities.filter((f: Facility) => f.region === region),
    [facilities, region]
  )

  const filtered = useMemo(
    () =>
      regionFacilities.filter((f: Facility) =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [regionFacilities, searchTerm]
  )

  const handleCellClick = (facility: Facility, field: keyof Facility) => {
    if (!isEditMode || currentUser.role === 'User') return

    setEditingCell({ facilityId: facility.id, field })
    setEditValue(String(facility[field] || ''))
  }

  const saveEdit = async (newValue?: string) => {
    if (!editingCell) return

    const valueToSave = newValue !== undefined ? newValue : editValue

    try {
      const { error } = await supabase
        .from('facilities')
        .update({ [editingCell.field]: valueToSave })
        .eq('id', editingCell.facilityId)

      if (error) throw error
      setEditingCell(null)
    } catch (error) {
      console.error('Error updating facility:', error)
      alert('Failed to save changes')
    }
  }

  const toggleRecruiting = async (facility: Facility) => {
    if (!isEditMode || currentUser.role === 'User') return

    try {
      const { error } = await supabase
        .from('facilities')
        .update({ recruiting: !facility.recruiting })
        .eq('id', facility.id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating facility:', error)
    }
  }

  const toggleOnboarding = async (facility: Facility) => {
    if (!isEditMode || currentUser.role === 'User') return

    try {
      const { error } = await supabase
        .from('facilities')
        .update({ onboarding: !facility.onboarding })
        .eq('id', facility.id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating facility:', error)
    }
  }

  const addNewRow = async () => {
    try {
      const newFacility = {
        name: 'New Facility',
        region: region,
        health_system: '',
        specialty: '',
        recruiting: false,
        onboarding: false,
        required_experience: '',
        orientation_dates: '',
        facility_requirements: '',
        dormancy_policy: '',
        current_employee_protocol: '',
      }

      const { error } = await supabase
        .from('facilities')
        .insert([newFacility])

      if (error) throw error
    } catch (error) {
      console.error('Error adding row:', error)
      alert('Failed to add new row')
    }
  }

  const deleteRow = async (facilityId: number) => {
    if (!confirm('Are you sure you want to delete this facility?')) return

    try {
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', facilityId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting facility:', error)
      alert('Failed to delete facility')
    }
  }

  const isAdmin = currentUser.role !== 'User'

  return (
    <div className="view active" style={{ padding: '28px', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '28px', color: '#1a3d5c', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px' }}>{region} Facilities</h2>
          <p style={{ fontSize: '13px', color: '#999' }}>Manage regional facility information and requirements</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentView('lookup')}
            style={{
              padding: '10px 18px',
              border: '1px solid #d0d0d0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              background: 'white',
              color: '#333',
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8f9fa'
              e.currentTarget.style.borderColor = '#bbb'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.borderColor = '#d0d0d0'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            ← Back
          </button>
          {isAdmin && (
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                background: isEditMode ? 'linear-gradient(135deg, #1a3d5c 0%, #0f2535 100%)' : 'linear-gradient(135deg, #d4e6f1 0%, #c8dfe9 100%)',
                color: isEditMode ? 'white' : '#0f3d5c',
                border: 'none',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                boxShadow: isEditMode ? '0 4px 12px rgba(26, 61, 92, 0.2)' : '0 2px 6px rgba(26, 61, 92, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = isEditMode ? '0 6px 20px rgba(26, 61, 92, 0.3)' : '0 4px 12px rgba(26, 61, 92, 0.15)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = isEditMode ? '0 4px 12px rgba(26, 61, 92, 0.2)' : '0 2px 6px rgba(26, 61, 92, 0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {isEditMode ? 'Done Editing' : 'Edit Tab'}
            </button>
          )}
        </div>
      </div>

      {isEditMode && isAdmin && (
        <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '12px 16px',
              border: '1.5px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              fontWeight: '500',
              boxSizing: 'border-box',
              background: 'white',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#1a3d5c'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26, 61, 92, 0.1)'
              e.currentTarget.style.background = '#f0fffe'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.background = 'white'
            }}
          />
          <button
            onClick={addNewRow}
            style={{
              padding: '12px 18px',
              background: 'linear-gradient(135deg, #d4e6f1 0%, #c8dfe9 100%)',
              color: '#0f3d5c',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
              boxShadow: '0 2px 6px rgba(26, 61, 92, 0.1)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(26, 61, 92, 0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(26, 61, 92, 0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            + Add Row
          </button>
        </div>
      )}

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
              <th>Facility Requirements</th>
              <th>Dormancy Policy</th>
              <th>Employee Protocol</th>
              {isEditMode && isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={isEditMode && isAdmin ? 11 : 10} style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
                  No facilities found
                </td>
              </tr>
            ) : (
              filtered.map((facility: Facility) => (
                <tr key={facility.id}>
                  <td style={isEditMode && isAdmin ? { cursor: 'pointer', background: '#fffde7' } : {}} onClick={() => handleCellClick(facility, 'name')}>
                    <strong dangerouslySetInnerHTML={{ __html: facility.name || '' }} />
                  </td>
                  <td style={isEditMode && isAdmin ? { cursor: 'pointer', background: '#fffde7' } : {}} onClick={() => handleCellClick(facility, 'health_system')}>
                    <div dangerouslySetInnerHTML={{ __html: facility.health_system || '' }} />
                  </td>
                  <td style={isEditMode && isAdmin ? { cursor: 'pointer', background: '#fffde7' } : {}} onClick={() => handleCellClick(facility, 'specialty')}>
                    <div dangerouslySetInnerHTML={{ __html: facility.specialty || '' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => toggleRecruiting(facility)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: isEditMode && isAdmin ? 'pointer' : 'default',
                        padding: 0,
                      }}
                    >
                      <span className={`checkbox-icon ${facility.recruiting ? 'checked' : 'unchecked'}`}>
                        {facility.recruiting ? '✓' : '✕'}
                      </span>
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => toggleOnboarding(facility)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: isEditMode && isAdmin ? 'pointer' : 'default',
                        padding: 0,
                      }}
                    >
                      <span className={`checkbox-icon ${facility.onboarding ? 'checked' : 'unchecked'}`}>
                        {facility.onboarding ? '✓' : '✕'}
                      </span>
                    </button>
                  </td>
                  <td style={isEditMode && isAdmin ? { cursor: 'pointer', background: '#fffde7' } : {}} onClick={() => handleCellClick(facility, 'required_experience')}>
                    <div dangerouslySetInnerHTML={{ __html: facility.required_experience || '' }} />
                  </td>
                  <td style={isEditMode && isAdmin ? { cursor: 'pointer', background: '#fffde7' } : {}} onClick={() => handleCellClick(facility, 'orientation_dates')}>
                    <div dangerouslySetInnerHTML={{ __html: facility.orientation_dates || '' }} />
                  </td>
                  <td style={isEditMode && isAdmin ? { cursor: 'pointer', background: '#fffde7' } : {}} onClick={() => handleCellClick(facility, 'facility_requirements')}>
                    <div dangerouslySetInnerHTML={{ __html: facility.facility_requirements || '' }} />
                  </td>
                  <td style={isEditMode && isAdmin ? { cursor: 'pointer', background: '#fffde7' } : {}} onClick={() => handleCellClick(facility, 'dormancy_policy')}>
                    <div dangerouslySetInnerHTML={{ __html: facility.dormancy_policy || '' }} />
                  </td>
                  <td style={isEditMode && isAdmin ? { cursor: 'pointer', background: '#fffde7' } : {}} onClick={() => handleCellClick(facility, 'current_employee_protocol')}>
                    <div dangerouslySetInnerHTML={{ __html: facility.current_employee_protocol || '' }} />
                  </td>
                  {isEditMode && isAdmin && (
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => deleteRow(facility.id)}
                        style={{
                          padding: '6px 10px',
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#d32f2f'
                          e.currentTarget.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f44336'
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingCell && (
        <EditModal
          field={editingCell.field}
          value={editValue}
          onChange={setEditValue}
          onSave={saveEdit}
          onClose={() => setEditingCell(null)}
        />
      )}
    </div>
  )
}
