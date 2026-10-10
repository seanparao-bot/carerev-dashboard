'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { generateRandomPassword, hashPassword } from '@/lib/auth-utils'

interface User {
  id: string
  email: string
  role: string
  is_active: boolean
  created_at: string
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const createAdmin = async () => {
    if (!newEmail.trim()) {
      setError('Email is required')
      return
    }

    try {
      const password = generateRandomPassword()
      console.log('Generated password:', password)
      const hashedPassword = await hashPassword(password)
      console.log('Hashed password:', hashedPassword)
      setGeneratedPassword(password)

      const { error } = await supabase
        .from('users')
        .insert([{
          email: newEmail,
          password_hash: hashedPassword,
          role: 'Admin',
          is_active: true,
        }])

      if (error) throw error

      setNewEmail('')
      setShowCreateForm(false)
      await fetchUsers()
    } catch (err: any) {
      console.error('Create admin error:', err)
      setError(err.message || 'Failed to create admin')
    }
  }

  const resetPassword = async (userId: string, email: string) => {
    try {
      const newPassword = generateRandomPassword()
      const hashedPassword = await hashPassword(newPassword)
      setGeneratedPassword(newPassword)

      const { error } = await supabase
        .from('users')
        .update({ password_hash: hashedPassword })
        .eq('id', userId)

      if (error) throw error
      await fetchUsers()
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    }
  }

  const toggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (error) throw error
      await fetchUsers()
    } catch (err: any) {
      setError(err.message || 'Failed to update user')
    }
  }

  if (loading) {
    return <div style={{ padding: '28px' }}>Loading users...</div>
  }

  return (
    <div className="view active" style={{ padding: '28px', flexDirection: 'column' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', color: '#1a3d5c', fontWeight: '700', marginBottom: '8px' }}>
          Admin Users
        </h2>
        <p style={{ fontSize: '13px', color: '#999' }}>Manage administrator accounts and permissions</p>
      </div>

      {error && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 14px',
          background: '#ffebee',
          border: '1px solid #ef5350',
          color: '#d32f2f',
          borderRadius: '8px',
          fontSize: '13px',
        }}>
          {error}
        </div>
      )}

      {generatedPassword && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 14px',
          background: '#e8f5e9',
          border: '1px solid #4caf50',
          color: '#2e7d32',
          borderRadius: '8px',
          fontSize: '13px',
        }}>
          ✓ Generated Password: <strong>{generatedPassword}</strong> (Share with the admin)
          <button
            onClick={() => {
              navigator.clipboard.writeText(generatedPassword)
              setGeneratedPassword('')
            }}
            style={{
              marginLeft: '10px',
              padding: '4px 8px',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Copy
          </button>
        </div>
      )}

      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        style={{
          marginBottom: '24px',
          padding: '12px 18px',
          background: 'linear-gradient(135deg, #1a3d5c 0%, #0f2535 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        {showCreateForm ? 'Cancel' : '+ Create New Admin'}
      </button>

      {showCreateForm && (
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          background: '#f5f5f5',
          borderRadius: '10px',
          border: '1px solid #e0e0e0',
        }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
            Admin Email
          </label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="admin@example.com"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1.5px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '12px',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={createAdmin}
            style={{
              padding: '10px 16px',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Create Admin
          </button>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '10px',
        border: '1px solid #e8eaed',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'linear-gradient(180deg, #f8f9fa 0%, #f3f5f7 100%)' }}>
            <tr>
              <th style={{
                padding: '14px 12px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '700',
                color: '#333',
                borderBottom: '2px solid #1a3d5c',
              }}>
                Email
              </th>
              <th style={{
                padding: '14px 12px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '700',
                color: '#333',
                borderBottom: '2px solid #1a3d5c',
              }}>
                Role
              </th>
              <th style={{
                padding: '14px 12px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '700',
                color: '#333',
                borderBottom: '2px solid #1a3d5c',
              }}>
                Status
              </th>
              <th style={{
                padding: '14px 12px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '700',
                color: '#333',
                borderBottom: '2px solid #1a3d5c',
              }}>
                Created
              </th>
              <th style={{
                padding: '14px 12px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '700',
                color: '#333',
                borderBottom: '2px solid #1a3d5c',
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#999' }}>
                  No users yet
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} style={{
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'all 0.2s ease',
                }}>
                  <td style={{ padding: '14px 12px', fontSize: '13px', color: '#333' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '13px', color: '#333' }}>
                    {user.role}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '13px', color: '#333' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: user.is_active ? '#e8f5e9' : '#ffebee',
                      color: user.is_active ? '#2e7d32' : '#d32f2f',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '13px', color: '#666' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '13px' }}>
                    <button
                      onClick={() => resetPassword(user.id, user.email)}
                      style={{
                        marginRight: '8px',
                        padding: '6px 10px',
                        background: '#ff9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => toggleActive(user.id, user.is_active)}
                      style={{
                        padding: '6px 10px',
                        background: user.is_active ? '#f44336' : '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
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
