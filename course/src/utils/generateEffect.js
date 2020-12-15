const generateEffect = (effect) => {
  return function* (...args) {
    const { onSuccess, onError, onFinish } = args[0]
    try {
      yield effect(...args)

      onSuccess && onSuccess()
    } catch (err) {
      onError && onError(err)
    } finally {
      onFinish && onFinish()
    }
  }
}

export default generateEffect
