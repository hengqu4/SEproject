import { useState, useCallback } from 'react'

const useForceUpdater = () => {
  const [_, setValue] = useState(0)
  const updater = useCallback(() => setValue((x) => x + 1), [setValue])

  return updater
}

export default useForceUpdater
