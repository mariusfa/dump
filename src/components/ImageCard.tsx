import { useState } from 'react'

interface ImageCardProps {
  imageUrl: string
  timestamp: number
  description?: string
  onDelete: () => void
  onUpdateDescription: (description: string) => void
}

export function ImageCard({ imageUrl, timestamp, description, onDelete, onUpdateDescription }: ImageCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(description || '')

  const handleSave = () => {
    onUpdateDescription(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(description || '')
    setIsEditing(false)
  }

  return (
    <div className="image-card">
      <img 
        src={imageUrl} 
        alt={description || 'DUMP memory'}
      />
      <div className="image-info">
        <span className="image-date">
          {new Date(timestamp).toLocaleDateString('nb-NO')}
        </span>
        <button 
          onClick={onDelete}
          className="delete-button"
          aria-label="Slett bilde"
        >
          🗑️
        </button>
      </div>
      
      {isEditing ? (
        <div className="description-edit">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Legg til beskrivelse..."
            className="description-input"
            autoFocus
          />
          <div className="description-actions">
            <button onClick={handleSave} className="save-button">
              Lagre
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        <div className="description-display">
          {description ? (
            <p className="description-text">{description}</p>
          ) : (
            <p className="description-placeholder">Ingen beskrivelse</p>
          )}
          <button 
            onClick={() => setIsEditing(true)} 
            className="edit-description-button"
          >
            {description ? '✏️ Rediger' : '➕ Legg til beskrivelse'}
          </button>
        </div>
      )}
    </div>
  )
}
