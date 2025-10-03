import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useImageUrls } from './useImageUrls'
import { type StoredImage } from '../lib/db'

describe('useImageUrls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates URLs for images', () => {
    const images: StoredImage[] = [
      { id: 1, file: new File(['test'], 'test.png'), timestamp: Date.now() }
    ]

    const { result } = renderHook(() => useImageUrls(images))
    
    const url = result.current.getImageUrl(1)
    expect(url).toBeDefined()
    expect(url).toMatch(/^blob:/)
  })

  it('returns undefined for non-existent image', () => {
    const { result } = renderHook(() => useImageUrls([]))
    
    const url = result.current.getImageUrl(999)
    expect(url).toBeUndefined()
  })

  it('reuses existing URLs when images unchanged', () => {
    const images: StoredImage[] = [
      { id: 1, file: new File(['test'], 'test.png'), timestamp: Date.now() }
    ]

    const { result, rerender, unmount } = renderHook(
      ({ imgs }) => useImageUrls(imgs),
      { initialProps: { imgs: images } }
    )
    
    const url1 = result.current.getImageUrl(1)
    
    rerender({ imgs: images })
    
    const url2 = result.current.getImageUrl(1)
    expect(url1).toBe(url2)
    
    unmount()
  })

  it('revokes URL when image removed', () => {
    const images: StoredImage[] = [
      { id: 1, file: new File(['test'], 'test.png'), timestamp: Date.now() }
    ]

    const { result } = renderHook(() => useImageUrls(images))
    
    const urlBefore = result.current.getImageUrl(1)
    expect(urlBefore).toBeDefined()
    
    result.current.revokeImageUrl(1)
    
    const urlAfter = result.current.getImageUrl(1)
    expect(urlAfter).toBeUndefined()
  })

  it('creates new URLs when new images added', () => {
    const images1: StoredImage[] = [
      { id: 1, file: new File(['test1'], 'test1.png'), timestamp: Date.now() }
    ]
    const images2: StoredImage[] = [
      ...images1,
      { id: 2, file: new File(['test2'], 'test2.png'), timestamp: Date.now() }
    ]

    const { result, rerender, unmount } = renderHook(
      ({ imgs }) => useImageUrls(imgs),
      { initialProps: { imgs: images1 } }
    )
    
    expect(result.current.getImageUrl(1)).toBeDefined()
    expect(result.current.getImageUrl(2)).toBeUndefined()
    
    rerender({ imgs: images2 })
    
    expect(result.current.getImageUrl(1)).toBeDefined()
    expect(result.current.getImageUrl(2)).toBeDefined()
    
    unmount()
  })
})
