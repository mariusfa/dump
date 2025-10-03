interface ImageCardProps {
  imageUrl: string
  timestamp: number
  description?: string
  onDelete: () => void
}

export function ImageCard({ imageUrl, timestamp, description, onDelete }: ImageCardProps) {
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
    </div>
  )
}
