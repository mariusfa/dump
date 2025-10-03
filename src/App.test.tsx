import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /huskeapp/i })).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<App />)
    expect(screen.getByText(/ta bilder av det du skal huske/i)).toBeInTheDocument()
  })

  it('renders camera button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /åpne kamera/i })).toBeInTheDocument()
  })

  it('renders file input with correct attributes', () => {
    render(<App />)
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('accept', 'image/*')
    expect(fileInput).toHaveAttribute('capture', 'environment')
  })
})
