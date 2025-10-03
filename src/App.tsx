import { useState } from 'react'
import './App.css'
import { useCameraCapture } from './hooks/useCameraCapture'
import { useImageStorage } from './hooks/useImageStorage'

function App() {
  const { images, loading, addImage, removeImage } = useImageStorage()
  const [imageUrls, setImageUrls] = useState<Map<number, string>>(new Map())

  const { fileInputRef, openCamera, handleCapture } = useCameraCapture({
    onCapture: async (file) => {
      await addImage(file)
    }
  })

  const getImageUrl = (id: number, file: File) => {
    if (!imageUrls.has(id)) {
      const url = URL.createObjectURL(file)
      setImageUrls(new Map(imageUrls.set(id, url)))
      return url
    }
    return imageUrls.get(id)!
  }

  const handleDelete = async (id: number) => {
    const url = imageUrls.get(id)
    if (url) {
      URL.revokeObjectURL(url)
      const newUrls = new Map(imageUrls)
      newUrls.delete(id)
      setImageUrls(newUrls)
    }
    await removeImage(id)
  }

  return (
    <div className="app">
      <header>
        <h1>DUMP</h1>
        <p className="subtitle">Digital Unorganized Memory Pile</p>
      </header>
      <main>
        <p>Ta bilder av det du skal huske</p>
        <button onClick={openCamera} className="camera-button">
          📷 Åpne kamera
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          style={{ display: 'none' }}
        />

        {loading && <p>Laster bilder...</p>}

        {!loading && images.length === 0 && (
          <p className="empty-state">Ingen bilder ennå. Ta et bilde for å komme i gang!</p>
        )}

        {!loading && images.length > 0 && (
          <div className="image-grid">
            {images.map((image) => (
              <div key={image.id} className="image-card">
                <img 
                  src={getImageUrl(image.id!, image.file)} 
                  alt={image.description || 'Huskelapp'}
                />
                <div className="image-info">
                  <span className="image-date">
                    {new Date(image.timestamp).toLocaleDateString('nb-NO')}
                  </span>
                  <button 
                    onClick={() => handleDelete(image.id!)}
                    className="delete-button"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
