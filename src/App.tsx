import './App.css'
import { useCameraCapture } from './hooks/useCameraCapture'

function App() {
  const { fileInputRef, openCamera, handleCapture } = useCameraCapture()

  return (
    <div className="app">
      <header>
        <h1>Huskeapp</h1>
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
      </main>
    </div>
  )
}

export default App
