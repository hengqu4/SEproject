import Mock from 'mockjs'

const nicknames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const fakeUserInfoArr = new Array(nicknames.length).fill(null).map((_, index) => ({
  nickname: nicknames[index],
  avatar: Mock.mock('@image'),
}))

export default fakeUserInfoArr
