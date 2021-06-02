import Mock from 'mockjs'

// eslint-disable-next-line
export const IP = SERVER_IP
// eslint-disable-next-line
export const PORT = WEBSOCKET_PORT

export const START_SIGNAL_CACHING_TIME = 65 * 1000

export const WAITING_FOR_READY_TIME = 15 * 1000

const nicknames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const fakeUserInfoArr = new Array(nicknames.length).fill(null).map((_, index) => ({
  nickname: nicknames[index],
  avatar: Mock.mock('@image'),
}))

export const Roles = {
  PRINCIPAL: 1,
  TEACHER: 2,
  TEACHING_ASSISTANT: 3,
  STUDENT: 4,
}

export const MatchingStatus = {
  IDLE: 'IDLE',
  SEARCHING_ROOM: 'SEARCHING_ROOM',
  MATCHING: 'MATCHING',
  WAITING_FOR_READY: 'WAITING_FOR_READY',
  ANSWERING: 'ANSWERING',
}
