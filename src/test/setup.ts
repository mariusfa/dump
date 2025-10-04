import '@testing-library/jest-dom'

// Mock File.arrayBuffer for tests
if (!File.prototype.arrayBuffer) {
  File.prototype.arrayBuffer = async function() {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.readAsArrayBuffer(this)
    })
  }
}

// Mock URL.createObjectURL and URL.revokeObjectURL for tests
global.URL.createObjectURL = (blob: Blob | MediaSource) => {
  return `blob:${Math.random().toString(36).substring(7)}`
}

global.URL.revokeObjectURL = (url: string) => {
  // no-op for tests
}
