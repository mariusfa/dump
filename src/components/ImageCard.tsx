import { useState, useEffect, useRef } from 'react'
import { useAudioRecorder } from '../hooks/useAudioRecorder'

interface ImageCardProps {
  imageUrl: string
  timestamp: number
  description?: string
  audioBlob?: Blob
  onDelete: () => void
  onUpdateDescription: (description: string) => void
  onUpdateAudio: (audioBlob: Blob) => void
}

export function ImageCard({ imageUrl, timestamp, description, audioBlob, onDelete, onUpdateDescription, onUpdateAudio }: ImageCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(description || '')
  const [isRecordingMode, setIsRecordingMode] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const { recordingState, audioBlob: recordedBlob, error, startRecording, stopRecording, cancelRecording, resetRecording } = useAudioRecorder()

  // Create audio URL from blob
  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [audioBlob])

  const handleSave = () => {
    onUpdateDescription(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(description || '')
    setIsEditing(false)
  }

  const handleStartRecording = async () => {
    setIsRecordingMode(true)
    await startRecording()
  }

  const handleStopRecording = () => {
    stopRecording()
  }

  const handleSaveAudio = () => {
    if (recordedBlob) {
      onUpdateAudio(recordedBlob)
      setIsRecordingMode(false)
      resetRecording()
    }
  }

  const handleCancelAudio = () => {
    cancelRecording()
    setIsRecordingMode(false)
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

      {/* Audio Section */}
      {isRecordingMode ? (
        <div className="audio-recording">
          {error && <p className="audio-error">{error}</p>}
          
          {recordingState === 'idle' && (
            <button onClick={handleStartRecording} className="audio-button start-recording">
              🎤 Start opptak
            </button>
          )}
          
          {recordingState === 'recording' && (
            <div className="recording-active">
              <span className="recording-indicator">🔴 Tar opp...</span>
              <button onClick={handleStopRecording} className="audio-button stop-recording">
                ⏹️ Stopp
              </button>
            </div>
          )}
          
          {recordingState === 'stopped' && recordedBlob && (
            <div className="recording-preview">
              <audio ref={audioRef} src={URL.createObjectURL(recordedBlob)} controls />
              <div className="audio-actions">
                <button onClick={handleSaveAudio} className="save-button">
                  Lagre
                </button>
                <button onClick={handleCancelAudio} className="cancel-button">
                  Avbryt
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="audio-display">
          {audioUrl ? (
            <div className="audio-player">
              <audio src={audioUrl} controls />
            </div>
          ) : (
            <button 
              onClick={handleStartRecording} 
              className="add-audio-button"
            >
              🎤 Legg til lydnotat
            </button>
          )}
        </div>
      )}
    </div>
  )
}
