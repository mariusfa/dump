import { useRef } from 'react'
import './App.css'

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('Bilde tatt:', file)
      // TODO: Lagre bilde i IndexedDB
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Huskeapp</h1>
      </header>
      <main>
        <p>Ta bilder av det du skal huske</p>
        <button onClick={handleCameraClick} className="camera-button">
          📷 Åpne kamera
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageCapture}
          style={{ display: 'none' }}
        />
      </main>
    </div>
  )
}

export default App
