import { ref, computed } from 'vue'
import { useCalendarMonth } from './useCalendarMonth.js'
import { useCalendarWeek } from './useCalendarWeek.js'
import { isSameDay, changeMonth } from '../utils'

// 周编码
const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']

export function useCalendar({ initialSelectedDate, initialWeekView, weekStart, markerDates, duration }, emit) {
  // 选中的日期
  const selected = ref(initialSelectedDate.value)

  // 当前展示的年份
  const currentYear = ref(initialSelectedDate.value.getFullYear())
  // 当前展示的月份(索引)
  const currentMonth = ref(initialSelectedDate.value.getMonth())
  // 保证weekStart在0-6之间
  const weekStartResolved = computed(() => weekStart.value % 7)

  // 月日期
  const { monthDates, prevMonthDates, nextMonthDates, monthRows, prevMonthRows, nextMonthRows } = useCalendarMonth({
    currentYear,
    currentMonth,
    weekStartResolved
  })

  // 是否显示周视图
  const isWeekView = ref(initialWeekView.value)
  // 周视图下，当前展示的周索引
  const weekIndex = ref(0)
  _setWeekIndex()

  //周日期
  const { weekDates, prevWeekDates, nextWeekDates } = useCalendarWeek({ currentMonth, monthDates, weekIndex })

  // 偏移后的周编码
  const weekdays = computed(() => {
    return WEEK_DAYS.slice(weekStartResolved.value).concat(WEEK_DAYS.slice(0, weekStartResolved.value))
  })

  // 当前展示月份第一天
  const currentMonthFirstDay = computed(() => new Date(currentYear.value, currentMonth.value, 1))
  // 当前展示月份最后一天
  const currentMonthLastDay = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0))

  // 当前周/月的日期
  const visibleDates = computed(() => (isWeekView.value ? weekDates.value : monthDates.value))
  // 上一周/月的日期
  const prevVisibleDates = computed(() => (isWeekView.value ? prevWeekDates.value : prevMonthDates.value))
  // 下一周/月的日期
  const nextVisibleDates = computed(() => (isWeekView.value ? nextWeekDates.value : nextMonthDates.value))

  // 页面实际渲染的日期
  const renderDates = computed(() => [prevVisibleDates.value, visibleDates.value, nextVisibleDates.value])

  // 根据当前周/月视图，计算页面实际渲染几周的日期(几行，用于动态计算组件高度)
  const visibleRows = computed(() => (isWeekView.value ? 1 : monthRows.value))
  // 上一周/月的行数
  const prevVisibleRows = computed(() => (isWeekView.value ? 1 : prevMonthRows.value))
  // 下一周/月的行数
  const nextVisibleRows = computed(() => (isWeekView.value ? 1 : nextMonthRows.value))

  // 标记日期
  const markerDateList = computed(() =>
    markerDates.value.map(item => ({
      date: new Date(typeof item === 'string' ? item : item.date),
      color: typeof item === 'object' && item.color ? item.color : 'var(--calendar-theme-color)'
    }))
  )

  // 切换选中的日期
  function _selectDate(calendarDate) {
    if (!isSameDay(calendarDate.date, selected.value)) {
      selected.value = new Date(calendarDate.date)
      emit('select-change', selected.value)
    }
  }

  // 向前或向后切换n个月
  function _changeMonth(n) {
    const { year, month } = changeMonth(currentYear.value, currentMonth.value, n)
    currentYear.value = year
    currentMonth.value = month
    weekIndex.value = 0 // 切换月份时重置周索引
  }

  // 向前切换一周
  function _goPrevWeek() {
    if (weekIndex.value >= 1) {
      weekIndex.value -= 1
    } else {
      _changeMonth(-1)
      if (isSameDay(monthDates.value[monthDates.value.length - 1].date, currentMonthLastDay.value)) {
        weekIndex.value = monthRows.value - 1
      } else {
        weekIndex.value = monthRows.value - 2
      }
    }
  }

  // 向后切换一周
  function _goNextWeek() {
    if (weekIndex.value < monthRows.value - 1) {
      weekIndex.value += 1
    } else {
      _changeMonth(1)
      if (isSameDay(monthDates.value[0].date, currentMonthFirstDay.value)) {
        weekIndex.value = 0
      } else {
        weekIndex.value = 1
      }
    }
  }

  // 向前翻一页
  function _goPrev() {
    if (isWeekView.value) {
      _goPrevWeek()
    } else {
      _changeMonth(-1)
    }
  }

  // 向后翻一页
  function _goNext() {
    if (isWeekView.value) {
      _goNextWeek()
    } else {
      _changeMonth(1)
    }
  }

  // 切换周/月视图
  function _toggleView() {
    isWeekView.value = !isWeekView.value
    _setWeekIndex()
    renderRows.value = visibleRows.value
  }

  // 切换至周视图时，需设置weekIndex
  function _setWeekIndex() {
    if (isWeekView.value) {
      // find selected in current month, default to first cell if not found
      const found = monthDates.value.findIndex(d => isSameDay(d.date, selected.value))
      const idx = Math.max(found, 0)
      weekIndex.value = Math.floor(idx / 7)
    }
  }

  // 滑动的距离
  const transformDistance = ref('0px')
  // 动画时间
  const transitionDuration = ref('0s')
  // 页面实际渲染的行数
  const renderRows = ref(visibleRows.value)
  // 是否正在滑动
  const isSwiping = ref(false)

  // 滑动动画开始
  function _onTransitionStart(direction) {
    transitionDuration.value = duration.value
    isSwiping.value = true
    if (direction === 'left') {
      transformDistance.value = '-100%'
      renderRows.value = nextVisibleRows.value
    } else if (direction === 'right') {
      transformDistance.value = '100%'
      renderRows.value = prevVisibleRows.value
    }
  }

  // 滑动动画结束，更新数据
  function _onTransitionEnd() {
    transitionDuration.value = '0s' // 将动画时间置为0，保证接下来修改数据时界面不变化
    if (transformDistance.value === '100%') {
      _goPrev()
    } else if (transformDistance.value === '-100%') {
      _goNext()
    }
    renderRows.value = visibleRows.value
    transformDistance.value = '0px' // 重置滑动距离
    isSwiping.value = false
  }

  return {
    selected,
    renderDates,
    isWeekView,
    weekdays,
    currentYear,
    currentMonth,
    markerDateList,
    transformDistance,
    transitionDuration,
    renderRows,
    isSwiping,
    selectDate: _selectDate,
    toggleView: _toggleView,
    changeMonth: _changeMonth,
    onTransitionStart: _onTransitionStart,
    onTransitionEnd: _onTransitionEnd
  }
}
