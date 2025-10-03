import { type ChangeEvent, type RefObject } from 'react'

interface CameraInputProps {
  inputRef: RefObject<HTMLInputElement | null>
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function CameraInput({ inputRef, onChange }: CameraInputProps) {
  return (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      capture="environment"
      onChange={onChange}
      style={{ display: 'none' }}
      data-testid="camera-input"
    />
  )
}
