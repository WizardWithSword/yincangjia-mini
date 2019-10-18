// miniprogram/pages/canlender.js
Component({
  properties: {
    blueDates: {
      type: Array,
      value: [],
    },
    pinkDates: {
      type: Array,
      value: [],
    },
    // 这里定义了innerText属性，属性值可以在组件使用时指定
  },
  ready() {
    console.log('ready, calender')
    const noww = new Date()
    this.setData({
      year: noww.getFullYear(),
      month: noww.getMonth()
    })
    this._formatDays() // 渲染日期
  },
  data: {
    // 这里是一些组件内部数据
    showDays: [],
    year: 2012,
    month: 2,
    days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  },
  methods: {
    chooseMonthLeft () {
      let year = this.data.year
      let month = this.data.month
      month--
      if (month < 0) {
        month = 11
        year--
        // 重新定义各个月份天数
        this.setData({
          days: getDays(year)
        })
      }
      this.setData({
        year: year,
        month: month
      })
      this.monthChange()
    },
    chooseMonthRight () {
      let year = this.data.year
      let month = this.data.month
      month++
      if (month > 11) {
        month = 0
        year++
        this.setData({
          days: getDays(year)
        })
      }
      this.setData({
        year: year,
        month: month
      })
      this.monthChange()
    },
    monthChange () {
      this._formatDays()
      let tmp = this.data.year + '-' + this.data.month
      this.triggerEvent('changeMonth', {date: tmp})
    },
    _formatDays () {
      let dateShow = []
      let monthDays = this.data.days[this.data.month]
      const thisMonth = addZero(this.data.month + 1)
      var i
      for (i = 0; i < monthDays; i++) {
        let obj = {}
        obj.showTxt = i + 1 // 界面上显示的日期
        obj.date = this.data.year + '-' + thisMonth + '-' + addZero(obj.showTxt)
        if (this.data.blueDates.indexOf(obj.date) !== -1) {
          obj.hasBlue = true
        }
        if (this.data.pinkDates.indexOf(obj.date) !== -1) {
          obj.hasPink = true
        }
        obj.disabled = false
        obj.week = getWeekDay(obj.date)
        dateShow.push(obj)
      }
      // console.log('dateShow', dateShow)
      let daysBefore = []
      // 如果当前月份第一天不是周日。用上一个月份的最后几天补齐
      if (dateShow[0].week > 0) {
        for (i = dateShow[0].week; i > 0; i--) {
          // console.log('前面补一天', i)
          let daytmp1 = getDayBeforeAfter(dateShow[0].date, i, 'before')
          let objB = {}
          objB.disabled = true
          objB.showTxt = daytmp1.day
          objB.date = daytmp1.year + '-' + addZero(daytmp1.month + 1) + '-' + addZero(daytmp1.day)
          objB.week = daytmp1.weekday
          daysBefore.push(objB)
        }
      }
      let daysAfter = []
      // console.log('dateShow[dateShow.length - 1]', dateShow[dateShow.length - 1])
      // 如果当前月份最后一天不是周六。用下一个月份的开始几天补齐
      if (dateShow[dateShow.length - 1].week < 6) {
        for (i = 0; i < 6 - dateShow[dateShow.length - 1].week; i++) {
          // console.log('后面补一天', i)
          let daytmp2 = getDayBeforeAfter(dateShow[dateShow.length - 1].date, i + 1, 'after')
          let objA = {}
          objA.disabled = true
          if (i == 0) {
            objA.showTxt = daytmp2.month + 1 + '月' + daytmp2.day + '日'
          } else {
            objA.showTxt = daytmp2.day
          }
          objA.date = daytmp2.year + '-' + addZero(daytmp2.month + 1) + '-' + daytmp2.day
          objA.week = daytmp2.weekday
          daysAfter.push(objA)
        }
      }
      dateShow = daysBefore.concat(dateShow)
      dateShow = dateShow.concat(daysAfter)
      this.setData({
        showDays: dateShow
      })
    },
    chooseDay (e) {
      console.log('choose day', e)
      this.triggerEvent('changeDay', {date: e.target.dataset.date})
    }
  }
})

// before 获得days天前的日期是哪天
// after  获得days天后的日期是哪天
function getDayBeforeAfter(date, days, beforeAfter) {
  const d = new Date(date)
  let newtime 
  if (beforeAfter == 'before') {
    newtime = d.getTime() - days * 86400000
  } else {
    newtime = d.getTime() + days * 86400000
  }
  const newd = new Date(newtime)
  const obj = {}
  obj.year = newd.getFullYear()
  obj.month = newd.getMonth()
  obj.day = newd.getDate()
  obj.weekday = newd.getDay()
  return obj
}

// 获得当前星期几
function getWeekDay (date) {
  const d = new Date(date)
  return d.getDay()
}
// 小于10补0
function addZero (num) {
  return num < 10 ? '0' + num : num + ''
}
// 获取当前年份每个月分别有多少天。
function getDays(year) {
  let tmp = []
  for(let i = 1; i < 13; i++) {
    tmp.push(new Date(year, i, 0).getDate())
  }
  return tmp
}