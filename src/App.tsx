import { useState } from 'react'
import './App.css'
import { useCameraCapture } from './hooks/useCameraCapture'
import { useImageStorage } from './hooks/useImageStorage'
import { useImageUrls } from './hooks/useImageUrls'
import { CameraInput } from './components/CameraInput'
import { LoadingState } from './components/LoadingState'
import { EmptyState } from './components/EmptyState'
import { ImageGrid } from './components/ImageGrid'
import { DevJourney } from './components/DevJourney'

function App() {
  const { images, loading, addImage, removeImage } = useImageStorage()
  const { getImageUrl, revokeImageUrl } = useImageUrls(images)
  const [showDevJourney, setShowDevJourney] = useState(false)

  const { fileInputRef, openCamera, handleCapture } = useCameraCapture({
    onCapture: async (file) => {
      await addImage(file)
    }
  })

  const handleDelete = async (id: number) => {
    revokeImageUrl(id)
    await removeImage(id)
  }

  return (
    <div className="app">
      <header>
        <h1>DUMP</h1>
        <p className="subtitle">Digital Unorganized Memory Pile</p>
        <button 
          onClick={() => setShowDevJourney(true)} 
          className="dev-journey-button"
          title="View development journey"
        >
          📊 Dev Journey
        </button>
      </header>
      <main>
        <p>Ta bilder av det du skal huske</p>
        <button onClick={openCamera} className="camera-button">
          📷 Åpne kamera
        </button>
        <CameraInput inputRef={fileInputRef} onChange={handleCapture} />

        {loading && <LoadingState />}

        {!loading && images.length === 0 && <EmptyState />}

        {!loading && images.length > 0 && (
          <ImageGrid 
            images={images} 
            getImageUrl={getImageUrl} 
            onDelete={handleDelete} 
          />
        )}
      </main>

      {showDevJourney && <DevJourney onClose={() => setShowDevJourney(false)} />}
    </div>
  )
}

export default App
