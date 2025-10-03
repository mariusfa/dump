import { useEffect, useRef, useState } from 'react'
import { type StoredImage } from '../lib/db'

export function useImageUrls(images: StoredImage[]) {
  const [imageUrls, setImageUrls] = useState<Map<number, string>>(new Map())
  const urlsRef = useRef<Map<number, string>>(new Map())

  useEffect(() => {
    const currentUrls = urlsRef.current
    const newUrls = new Map<number, string>()

    images.forEach((image) => {
      if (image.id && image.imageData) {
        if (currentUrls.has(image.id)) {
          newUrls.set(image.id, currentUrls.get(image.id)!)
        } else {
          try {
            const url = URL.createObjectURL(image.imageData)
            newUrls.set(image.id, url)
          } catch (err) {
            console.error('Failed to create URL for image', image.id, err)
          }
        }
      }
    })

    currentUrls.forEach((url, id) => {
      if (!newUrls.has(id)) {
        URL.revokeObjectURL(url)
      }
    })

    urlsRef.current = newUrls
    setImageUrls(newUrls)
  }, [images])

  useEffect(() => {
    return () => {
      urlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [])

  const getImageUrl = (id: number): string | undefined => {
    return imageUrls.get(id)
  }

  const revokeImageUrl = (id: number) => {
    const url = imageUrls.get(id)
    if (url) {
      URL.revokeObjectURL(url)
      const newUrls = new Map(imageUrls)
      newUrls.delete(id)
      setImageUrls(newUrls)
      urlsRef.current = newUrls
    }
  }

  return {
    getImageUrl,
    revokeImageUrl
  }
}
