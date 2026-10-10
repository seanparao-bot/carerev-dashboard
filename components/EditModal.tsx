'use client'

import { useRef, useState, useEffect } from 'react'

export default function EditModal({ field, value, onChange, onSave, onClose }: any) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [selectedColor, setSelectedColor] = useState('#000000')

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const handleSave = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML
      onChange(newValue)
      // Call onSave with the new value directly, don't rely on state update
      onSave?.(newValue)
      onClose()
    }
  }

  const formatFieldName = (fieldName: string) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  const fieldLabel = formatFieldName(field)

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Green', hex: '#00AA00' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Indigo', hex: '#4B0082' },
    { name: 'Violet', hex: '#9400D3' },
  ]

  return (
    <div style={{
      position: 'fixed',
      inset: '0',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000',
      backdropFilter: 'blur(3px)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '650px',
        animation: 'slideUp 0.3s ease',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        <div style={{
          marginBottom: '28px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a3d5c',
            marginBottom: '8px',
          }}>
            Edit {fieldLabel}
          </h2>
          <p style={{
            fontSize: '13px',
            color: '#999',
          }}>
            Select text and use the formatting options below to style your content
          </p>
        </div>

        {/* Formatting Toolbar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          padding: '16px',
          background: '#f5f5f5',
          borderRadius: '10px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => applyFormatting('bold')}
              title="Bold - Select text and click"
              style={{
                padding: '8px 12px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8eaed'
                e.currentTarget.style.borderColor = '#bbb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#ddd'
              }}
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => applyFormatting('italic')}
              title="Italic - Select text and click"
              style={{
                padding: '8px 12px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '13px',
                fontStyle: 'italic',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8eaed'
                e.currentTarget.style.borderColor = '#bbb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#ddd'
              }}
            >
              <em>I</em>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderLeft: '1px solid #ddd', paddingLeft: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#666' }}>Color:</span>
            {colors.map((color) => (
              <button
                key={color.hex}
                onClick={() => {
                  setSelectedColor(color.hex)
                  applyFormatting('foreColor', color.hex)
                }}
                title={`${color.name} - Select text and click`}
                style={{
                  width: '24px',
                  height: '24px',
                  border: selectedColor === color.hex ? '3px solid #333' : '2px solid #ddd',
                  borderRadius: '4px',
                  background: color.hex,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderLeft: '1px solid #ddd', paddingLeft: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#666' }}>Align:</span>
            <button
              onClick={() => applyFormatting('justifyLeft')}
              title="Align Left"
              style={{
                padding: '6px 10px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8eaed'
                e.currentTarget.style.borderColor = '#bbb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#ddd'
              }}
            >
              ←
            </button>
            <button
              onClick={() => applyFormatting('justifyCenter')}
              title="Align Center"
              style={{
                padding: '6px 10px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8eaed'
                e.currentTarget.style.borderColor = '#bbb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#ddd'
              }}
            >
              ⊕
            </button>
            <button
              onClick={() => applyFormatting('justifyRight')}
              title="Align Right"
              style={{
                padding: '6px 10px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8eaed'
                e.currentTarget.style.borderColor = '#bbb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#ddd'
              }}
            >
              →
            </button>
          </div>
        </div>

        <div style={{
          marginBottom: '28px',
        }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '700',
            marginBottom: '12px',
            color: '#333',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Content
          </label>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            style={{
              width: '100%',
              padding: '16px',
              border: '1.5px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '14px',
              fontFamily: 'inherit',
              minHeight: '200px',
              maxHeight: '350px',
              overflowY: 'auto',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
              color: '#333',
              fontWeight: '500',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#1a3d5c'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26, 61, 92, 0.1)'
              e.currentTarget.style.background = 'linear-gradient(to bottom, #f0fffe, white)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.background = 'white'
            }}
            onMouseUp={() => {
              const selection = window.getSelection()
              if (selection && selection.toString().length > 0) {
                // User has selected text - formatting buttons will work
              }
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '32px',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px 20px',
              border: '1.5px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              background: 'white',
              color: '#333',
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8f9fa'
              e.currentTarget.style.borderColor = '#bbb'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.borderColor = '#e0e0e0'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #1a3d5c 0%, #0f2535 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
              boxShadow: '0 6px 16px rgba(26, 61, 92, 0.2)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(26, 61, 92, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(26, 61, 92, 0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
