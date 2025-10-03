import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /huskeapp/i })).toBeInTheDocument()
  })

  it('renders camera button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /åpne kamera/i })).toBeInTheDocument()
  })

  it('triggers file input when camera button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const clickSpy = vi.spyOn(fileInput, 'click')
    
    const button = screen.getByRole('button', { name: /åpne kamera/i })
    await user.click(button)
    
    expect(clickSpy).toHaveBeenCalled()
  })

  it('file input has correct attributes for rear camera', () => {
    render(<App />)
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    
    expect(fileInput).toHaveAttribute('accept', 'image/*')
    expect(fileInput).toHaveAttribute('capture', 'environment')
  })

  it('handles image capture', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log')
    
    render(<App />)
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    
    await user.upload(fileInput, file)
    
    expect(consoleSpy).toHaveBeenCalledWith('Bilde tatt:', file)
  })
})
