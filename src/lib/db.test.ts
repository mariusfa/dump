import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { openDB, saveImage, getAllImages, deleteImage, type StoredImage } from './db'

describe('IndexedDB utilities', () => {
  beforeEach(async () => {
    const db = await openDB()
    const transaction = db.transaction('images', 'readwrite')
    const store = transaction.objectStore('images')
    store.clear()
    db.close()
  })

  it('opens database successfully', async () => {
    const db = await openDB()
    expect(db).toBeDefined()
    expect(db.name).toBe('huskeapp')
    expect(db.objectStoreNames.contains('images')).toBe(true)
    db.close()
  })

  it('saves image to database', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const image: Omit<StoredImage, 'id'> = {
      file,
      timestamp: Date.now()
    }

    const id = await saveImage(image)
    expect(id).toBeTypeOf('number')
    expect(id).toBeGreaterThan(0)
  })

  it('retrieves all images from database', async () => {
    const file1 = new File(['test1'], 'test1.png', { type: 'image/png' })
    const file2 = new File(['test2'], 'test2.png', { type: 'image/png' })

    await saveImage({ file: file1, timestamp: Date.now() })
    await saveImage({ file: file2, timestamp: Date.now() })

    const images = await getAllImages()
    expect(images).toHaveLength(2)
    expect(images[0].file).toBeDefined()
    expect(images[1].file).toBeDefined()
  })

  it('deletes image from database', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const id = await saveImage({ file, timestamp: Date.now() })

    await deleteImage(id)

    const images = await getAllImages()
    expect(images).toHaveLength(0)
  })

  it('saves image with description', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const image: Omit<StoredImage, 'id'> = {
      file,
      timestamp: Date.now(),
      description: 'Test description'
    }

    await saveImage(image)
    const images = await getAllImages()
    
    expect(images[0].description).toBe('Test description')
  })
})
