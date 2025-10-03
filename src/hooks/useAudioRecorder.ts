import { useState, useRef, useCallback } from 'react'

export type RecordingState = 'idle' | 'recording' | 'stopped'

export function useAudioRecorder() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      chunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' })
        setAudioBlob(blob)
        setRecordingState('stopped')
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setRecordingState('recording')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording')
      setRecordingState('idle')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [recordingState])

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      }
    }
    setAudioBlob(null)
    setRecordingState('idle')
    chunksRef.current = []
  }, [])

  const resetRecording = useCallback(() => {
    setAudioBlob(null)
    setRecordingState('idle')
    setError(null)
    chunksRef.current = []
  }, [])

  return {
    recordingState,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording
  }
}
