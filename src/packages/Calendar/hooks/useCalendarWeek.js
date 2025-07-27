import { computed } from 'vue'
import { CalendarDate } from '../utils/index.js'

export function useCalendarWeek({ currentMonth, monthDates, weekIndex }) {
  // 根据 weekIndex 计算周视图渲染的日期
  const weekDates = computed(() => monthDates.value.slice(weekIndex.value * 7, weekIndex.value * 7 + 7))

  // 计算weekDates上一周渲染的日期
  const prevWeekDates = computed(() => {
    return weekDates.value.map(({ date }) => {
      const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
      return new CalendarDate(newDate, newDate.getMonth() === currentMonth.value)
    })
  })

  // 计算weekDates下一周渲染的日期
  const nextWeekDates = computed(() => {
    return weekDates.value.map(({ date }) => {
      const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)
      return new CalendarDate(newDate, newDate.getMonth() === currentMonth.value)
    })
  })

  return {
    weekDates,
    prevWeekDates,
    nextWeekDates
  }
}
