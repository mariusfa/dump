import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { CameraInput } from './CameraInput'

function TestWrapper() {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleChange = vi.fn()
  
  return <CameraInput inputRef={inputRef} onChange={handleChange} />
}

describe('CameraInput', () => {
  it('renders hidden file input', () => {
    render(<TestWrapper />)
    const input = screen.getByTestId('camera-input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'file')
  })

  it('has correct attributes for rear camera', () => {
    render(<TestWrapper />)
    const input = screen.getByTestId('camera-input')
    
    expect(input).toHaveAttribute('accept', 'image/*')
    expect(input).toHaveAttribute('capture', 'environment')
  })

  it('calls onChange when file selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    
    function TestComponent() {
      const inputRef = useRef<HTMLInputElement>(null)
      return <CameraInput inputRef={inputRef} onChange={onChange} />
    }
    
    render(<TestComponent />)
    
    const input = screen.getByTestId('camera-input')
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    await user.upload(input, file)
    
    expect(onChange).toHaveBeenCalled()
  })
})
