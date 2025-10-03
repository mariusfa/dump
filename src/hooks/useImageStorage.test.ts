import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useImageStorage } from './useImageStorage'
import * as db from '../lib/db'

vi.mock('../lib/db')

describe('useImageStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads images on mount', async () => {
    const mockImages = [
      { id: 1, imageData: new Blob(['test'], { type: 'image/png' }), imageType: 'image/png', timestamp: Date.now() }
    ]
    vi.mocked(db.getAllImages).mockResolvedValue(mockImages)

    const { result } = renderHook(() => useImageStorage())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.images).toEqual(mockImages)
    expect(db.getAllImages).toHaveBeenCalledOnce()
  })

  it('sorts images by timestamp descending', async () => {
    const mockImages = [
      { id: 1, imageData: new Blob(['test1'], { type: 'image/png' }), imageType: 'image/png', timestamp: 1000 },
      { id: 2, imageData: new Blob(['test2'], { type: 'image/png' }), imageType: 'image/png', timestamp: 3000 },
      { id: 3, imageData: new Blob(['test3'], { type: 'image/png' }), imageType: 'image/png', timestamp: 2000 }
    ]
    vi.mocked(db.getAllImages).mockResolvedValue(mockImages)

    const { result } = renderHook(() => useImageStorage())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.images[0].id).toBe(2)
    expect(result.current.images[1].id).toBe(3)
    expect(result.current.images[2].id).toBe(1)
  })

  it('adds image successfully', async () => {
    vi.mocked(db.getAllImages).mockResolvedValue([])
    vi.mocked(db.saveImage).mockResolvedValue(1)

    const { result } = renderHook(() => useImageStorage())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const imageData = new Blob(['test'], { type: 'image/png' })
    
    const newImage = { id: 1, imageData, imageType: 'image/png', timestamp: Date.now() }
    vi.mocked(db.getAllImages).mockResolvedValue([newImage])

    await result.current.addImage(file, 'Test description')

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1)
    })

    expect(db.saveImage).toHaveBeenCalledWith(
      expect.objectContaining({
        file,
        description: 'Test description'
      })
    )
  })

  it('removes image successfully', async () => {
    const mockImage = { id: 1, imageData: new Blob(['test'], { type: 'image/png' }), imageType: 'image/png', timestamp: Date.now() }
    vi.mocked(db.getAllImages).mockResolvedValue([mockImage])
    vi.mocked(db.deleteImage).mockResolvedValue()

    const { result } = renderHook(() => useImageStorage())

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1)
    })

    vi.mocked(db.getAllImages).mockResolvedValue([])

    await result.current.removeImage(1)

    await waitFor(() => {
      expect(result.current.images).toHaveLength(0)
    })

    expect(db.deleteImage).toHaveBeenCalledWith(1)
  })

  it('handles errors when loading images', async () => {
    const error = new Error('Database error')
    vi.mocked(db.getAllImages).mockRejectedValue(error)

    const { result } = renderHook(() => useImageStorage())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toEqual(error)
  })

  it('refreshes images', async () => {
    vi.mocked(db.getAllImages).mockResolvedValue([])

    const { result } = renderHook(() => useImageStorage())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const newImage = { id: 1, imageData: new Blob(['test'], { type: 'image/png' }), imageType: 'image/png', timestamp: Date.now() }
    vi.mocked(db.getAllImages).mockResolvedValue([newImage])

    await result.current.refresh()

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1)
    })

    expect(db.getAllImages).toHaveBeenCalledTimes(2)
  })
})
