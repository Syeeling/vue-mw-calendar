export class CalendarDate {
  constructor(date, current) {
    this.key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    this.date = new Date(date)
    this.fullDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate()
    }
    this.current = current
  }
}

export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function changeMonth(year, month, dir) {
  const totalMonths = year * 12 + month + dir
  const newYear = Math.floor(totalMonths / 12)
  const newMonth = ((totalMonths % 12) + 12) % 12
  return { year: newYear, month: newMonth }
}

export function createMonthDates(year, month, index) {
  const monthFirstDate = new Date(year, month, 1) // 当月第一天
  const monthLastDate = new Date(year, month + 1, 0) // 当月最后一天
  const firstDateOfWeekIndex = (monthFirstDate.getDay() - index + 7) % 7 // 调整为指定周起始日的索引
  const dates = []
  // 填充当前月份第一周前面上个月的日期
  for (let i = 0; i < firstDateOfWeekIndex; i++) {
    const d = new Date(year, month, i - firstDateOfWeekIndex + 1)
    const cDate = new CalendarDate(d, false)
    dates.push(cDate)
  }
  // 填充当前月份的日期
  for (let i = 1; i <= monthLastDate.getDate(); i++) {
    const d = new Date(year, month, i)
    const cDate = new CalendarDate(d, true)
    dates.push(cDate)
  }
  // 填充当前月份最后一周后面下个月的日期
  const extra = (7 - (dates.length % 7)) % 7
  for (let i = 1; i <= extra; i++) {
    const d = new Date(year, month + 1, i)
    const cDate = new CalendarDate(d, false)
    dates.push(cDate)
  }
  return dates
}
