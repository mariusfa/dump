import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCameraCapture } from './useCameraCapture'

describe('useCameraCapture', () => {
  it('returns fileInputRef, openCamera, and handleCapture', () => {
    const { result } = renderHook(() => useCameraCapture())
    
    expect(result.current.fileInputRef).toBeDefined()
    expect(result.current.openCamera).toBeTypeOf('function')
    expect(result.current.handleCapture).toBeTypeOf('function')
  })

  it('openCamera triggers click on file input', () => {
    const { result } = renderHook(() => useCameraCapture())
    
    const mockClick = vi.fn()
    result.current.fileInputRef.current = {
      click: mockClick
    } as any
    
    act(() => {
      result.current.openCamera()
    })
    
    expect(mockClick).toHaveBeenCalled()
  })

  it('handleCapture returns file when file is selected', () => {
    const { result } = renderHook(() => useCameraCapture())
    const consoleSpy = vi.spyOn(console, 'log')
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    const event = {
      target: {
        files: [file]
      }
    } as any
    
    let capturedFile: File | null = null
    act(() => {
      capturedFile = result.current.handleCapture(event)
    })
    
    expect(capturedFile).toBe(file)
    expect(consoleSpy).toHaveBeenCalledWith('Bilde tatt:', file)
  })

  it('handleCapture returns null when no file is selected', () => {
    const { result } = renderHook(() => useCameraCapture())
    
    const event = {
      target: {
        files: []
      }
    } as any
    
    let capturedFile: File | null | undefined
    act(() => {
      capturedFile = result.current.handleCapture(event)
    })
    
    expect(capturedFile).toBeNull()
  })

  it('openCamera does nothing when ref is not set', () => {
    const { result } = renderHook(() => useCameraCapture())
    
    expect(() => {
      act(() => {
        result.current.openCamera()
      })
    }).not.toThrow()
  })
})
