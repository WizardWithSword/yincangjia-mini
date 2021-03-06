function addZero (val) {
  return val < 10 ? '0' + val : val
}
function formatTimeToDate (time) {
  if (time) {
    let date = new Date(time)
    let Y, M, D, h, m, s
    Y = date.getFullYear() + '-'
    M = addZero(date.getMonth() + 1) + '-'
    D = addZero(date.getDate()) + ' '
    h = addZero(date.getHours()) + ':'
    m = addZero(date.getMinutes()) + ':'
    s = addZero(date.getSeconds())
    return Y + M + D + h + m + s
  } else {
    return ''
  }
}
/**
 * 计算时间离现在的长度。
 * @param  {[type]} time [description]
 * @return {[type]}      [description]
 */
function formatTime (time) {
  if (time) {
    let date = new Date(time)
    let now = new Date()
    let last = (now.getTime() - date.getTime()) / 1000 // 秒
    if (last < 60) {
      return '刚刚'
    } else if (last > 60 && last < 60 * 60) {
      return parseInt(last/60) + '分钟前'
    } else if (last > 60 * 60 && last < 60 * 60 * 24) {
      return parseInt(last/3600) + '小时前'
    } else if (last > 24 * 60 * 60 && last < 2 * 24 * 60 * 60) {
      return '昨天'
    } else {
      return formatTimeToDate(time)
    }
  } else {
    return ''
  }
}
const common = {}
common.formatTime = formatTime
common.formatTimeToDate = formatTimeToDate
module.exports = common
