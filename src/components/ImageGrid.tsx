import { type StoredImage } from '../lib/db'
import { ImageCard } from './ImageCard'

interface ImageGridProps {
  images: StoredImage[]
  getImageUrl: (id: number) => string | undefined
  onDelete: (id: number) => void
  onUpdateDescription: (id: number, description: string) => void
}

export function ImageGrid({ images, getImageUrl, onDelete, onUpdateDescription }: ImageGridProps) {
  return (
    <div className="image-grid">
      {images.map((image) => {
        const imageUrl = getImageUrl(image.id!)
        if (!imageUrl) return null

        return (
          <ImageCard
            key={image.id}
            imageUrl={imageUrl}
            timestamp={image.timestamp}
            description={image.description}
            onDelete={() => onDelete(image.id!)}
            onUpdateDescription={(description) => onUpdateDescription(image.id!, description)}
          />
        )
      })}
    </div>
  )
}
