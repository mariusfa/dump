import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { type ChangeEvent } from 'react'
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
    } as unknown as HTMLInputElement
    
    act(() => {
      result.current.openCamera()
    })
    
    expect(mockClick).toHaveBeenCalled()
  })

  it('handleCapture returns file when file is selected', async () => {
    const { result } = renderHook(() => useCameraCapture())
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    const event = {
      target: {
        files: [file]
      }
    } as unknown as ChangeEvent<HTMLInputElement>
    
    let capturedFile: File | null = null
    await act(async () => {
      capturedFile = await result.current.handleCapture(event)
    })
    
    expect(capturedFile).toBe(file)
  })

  it('handleCapture returns null when no file is selected', async () => {
    const { result } = renderHook(() => useCameraCapture())
    
    const event = {
      target: {
        files: []
      }
    } as unknown as ChangeEvent<HTMLInputElement>
    
    let capturedFile: File | null | undefined
    await act(async () => {
      capturedFile = await result.current.handleCapture(event)
    })
    
    expect(capturedFile).toBeNull()
  })

  it('calls onCapture callback when provided', async () => {
    const onCapture = vi.fn()
    const { result } = renderHook(() => useCameraCapture({ onCapture }))
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    const event = {
      target: {
        files: [file]
      }
    } as unknown as ChangeEvent<HTMLInputElement>
    
    await act(async () => {
      await result.current.handleCapture(event)
    })
    
    expect(onCapture).toHaveBeenCalledWith(file)
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
