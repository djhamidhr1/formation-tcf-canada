import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(initialSeconds, onExpire) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            onExpire?.()
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const start = useCallback(() => setRunning(true), [])
  const pause = useCallback(() => setRunning(false), [])
  const reset = useCallback((newSeconds) => {
    setRunning(false)
    setSeconds(newSeconds ?? initialSeconds)
  }, [initialSeconds])

  return { seconds, running, start, pause, reset }
}
