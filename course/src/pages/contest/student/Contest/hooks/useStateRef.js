import { useRef, useCallback } from 'react'

const useStateRef = (initialValue) => {
  const ref = useRef(initialValue)

  const setRef = useCallback((newValue) => {
    ref.current = newValue
  }, [])

  return [ref.current, setRef]
}

export default useStateRef
