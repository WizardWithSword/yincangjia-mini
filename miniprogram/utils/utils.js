function addZero (val) {
  return val < 10 ? '0' + val : val
}
function formatTimeToDate (time) {
  if (time) {
    var date = new Date(time)
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