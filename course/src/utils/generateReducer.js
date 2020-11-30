import cloneDeep from 'lodash/cloneDeep'

const generateReducer = ({
  attributeName,
  transformer = (payload) => payload,
  defaultState = {},
}) => {
  return (state, { payload }) => {
    const newState = cloneDeep(state) || defaultState

    newState[attributeName] = transformer(payload, state)

    return newState
  }
}

export const defaultArrayTransformer = (payload) => payload || []
export const defaultObjectTransformer = (payload) => payload || {}

export default generateReducer
