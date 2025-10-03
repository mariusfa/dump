import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import 'fake-indexeddb/auto'
import App from './App'

beforeEach(() => {
  indexedDB.deleteDatabase('dump-app')
})

describe('App', () => {
  it('renders heading', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dump/i })).toBeInTheDocument()
    })
  })

  it('renders description text', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText(/ta bilder av det du skal huske/i)).toBeInTheDocument()
    })
  })

  it('renders camera button', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /åpne kamera/i })).toBeInTheDocument()
    })
  })

  it('renders file input with correct attributes', async () => {
    render(<App />)
    
    await waitFor(() => {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      
      expect(fileInput).toBeInTheDocument()
      expect(fileInput).toHaveAttribute('accept', 'image/*')
      expect(fileInput).toHaveAttribute('capture', 'environment')
    })
  })

  it('shows empty state when no images', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/ingen bilder ennå/i)).toBeInTheDocument()
    })
  })
})
