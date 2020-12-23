import moment from 'moment'

export default function formatTime(time = Date.now(), formatStr = 'YYYY-MM-DD HH:mm') {
  return moment(time).format(formatStr)
}
