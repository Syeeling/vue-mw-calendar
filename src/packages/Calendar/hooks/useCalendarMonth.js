import { computed } from 'vue'
import { changeMonth, createMonthDates } from '../utils/index.js'

export function useCalendarMonth({ currentYear, currentMonth, weekStartResolved }) {
  // 当前展示月份日期
  const monthDates = computed(() => {
    return createMonthDates(currentYear.value, currentMonth.value, weekStartResolved.value)
  })

  // 当前展示月的上一个月渲染的日期
  const prevMonthDates = computed(() => {
    const { year, month } = changeMonth(currentYear.value, currentMonth.value, -1)
    return createMonthDates(year, month, weekStartResolved.value)
  })

  // 当前展示月的下一个月渲染的日期
  const nextMonthDates = computed(() => {
    const { year, month } = changeMonth(currentYear.value, currentMonth.value, 1)
    return createMonthDates(year, month, weekStartResolved.value)
  })

  // 当前月份一共有几周
  const monthRows = computed(() => Math.ceil(monthDates.value.length / 7))

  // 上一个月渲染的日期有几周
  const prevMonthRows = computed(() => Math.ceil(prevMonthDates.value.length / 7))

  // 下一个月渲染的日期有几周
  const nextMonthRows = computed(() => Math.ceil(nextMonthDates.value.length / 7))

  return {
    monthDates,
    prevMonthDates,
    nextMonthDates,
    monthRows,
    prevMonthRows,
    nextMonthRows
  }
}
