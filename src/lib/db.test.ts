import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import 'fake-indexeddb/auto'
import { openDB, saveImage, getAllImages, updateImage, deleteImage, type StoredImage } from './db'

describe('IndexedDB utilities', () => {
  beforeEach(async () => {
    await new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase('dump-app')
      request.onsuccess = () => setTimeout(resolve, 10)
      request.onerror = () => setTimeout(resolve, 10)
      request.onblocked = () => setTimeout(resolve, 10)
    })
  })

  afterEach(async () => {
    await new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase('dump-app')
      request.onsuccess = () => setTimeout(resolve, 10)
      request.onerror = () => setTimeout(resolve, 10)
      request.onblocked = () => setTimeout(resolve, 10)
    })
  })

  it('opens database successfully', async () => {
    const db = await openDB()
    expect(db).toBeDefined()
    expect(db.name).toBe('dump-app')
    expect(db.objectStoreNames.contains('images')).toBe(true)
    db.close()
  })

  it('saves image to database', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const imageData = new Blob([await file.arrayBuffer()], { type: file.type })
    const image: Omit<StoredImage, 'id'> = {
      imageData,
      imageType: file.type,
      timestamp: Date.now()
    }

    const id = await saveImage(image)
    expect(id).toBeTypeOf('number')
    expect(id).toBeGreaterThan(0)
  })

  it('retrieves all images from database', async () => {
    const file1 = new File(['test1'], 'test1.png', { type: 'image/png' })
    const file2 = new File(['test2'], 'test2.png', { type: 'image/png' })
    const imageData1 = new Blob([await file1.arrayBuffer()], { type: file1.type })
    const imageData2 = new Blob([await file2.arrayBuffer()], { type: file2.type })

    const imagesBefore = await getAllImages()
    const countBefore = imagesBefore.length

    await saveImage({ imageData: imageData1, imageType: file1.type, timestamp: Date.now() })
    await saveImage({ imageData: imageData2, imageType: file2.type, timestamp: Date.now() })

    const imagesAfter = await getAllImages()
    expect(imagesAfter.length).toBe(countBefore + 2)
    expect(imagesAfter[countBefore].imageData).toBeDefined()
    expect(imagesAfter[countBefore + 1].imageData).toBeDefined()
  })

  it('deletes image from database', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const imageData = new Blob([await file.arrayBuffer()], { type: file.type })
    const id = await saveImage({ imageData, imageType: file.type, timestamp: Date.now() })

    const imagesBefore = await getAllImages()
    const countBefore = imagesBefore.length

    await deleteImage(id)

    const imagesAfter = await getAllImages()
    expect(imagesAfter.length).toBe(countBefore - 1)
  })

  it('saves image with description', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const imageData = new Blob([await file.arrayBuffer()], { type: file.type })
    const image: Omit<StoredImage, 'id'> = {
      imageData,
      imageType: file.type,
      timestamp: Date.now(),
      description: 'Test description'
    }

    const id = await saveImage(image)
    const images = await getAllImages()
    const savedImage = images.find(img => img.id === id)
    
    expect(savedImage).toBeDefined()
    expect(savedImage!.description).toBe('Test description')
  })

  it('updates image description', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const imageData = new Blob([await file.arrayBuffer()], { type: file.type })
    const id = await saveImage({ imageData, imageType: file.type, timestamp: Date.now() })

    await updateImage(id, { description: 'Updated description' })

    const images = await getAllImages()
    const updatedImage = images.find(img => img.id === id)
    
    expect(updatedImage).toBeDefined()
    expect(updatedImage!.description).toBe('Updated description')
  })

  it('throws error when updating non-existent image', async () => {
    await expect(updateImage(999, { description: 'Test' })).rejects.toThrow('Image not found')
  })
})
