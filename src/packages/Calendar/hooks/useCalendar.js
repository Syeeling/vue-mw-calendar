import { ref, computed } from 'vue'
import { createMonthDates, createWeekDates, isSameDay } from '../utils/index.js'

export function useCalendar({ initialSelectedDate, initialViewMode, weekStart, duration }, emit) {
  // 选中的日期
  const selected = ref(initialSelectedDate.value)
  // 当前渲染页年份
  const currentYear = ref(initialSelectedDate.value.getFullYear())
  // 当前渲染页月份(索引)
  const currentMonth = ref(initialSelectedDate.value.getMonth())
  // 当前渲染视图模式
  const viewMode = ref(initialViewMode.value)
  // 周视图下，当前展示的周索引
  const weekIndex = ref(0)
  _setWeekIndex()

  // 当前渲染页月日期
  const currentMonthDates = computed(() => {
    return createMonthDates(new Date(currentYear.value, currentMonth.value), weekStart.value)
  })
  // 当前渲染页周日期
  const currentWeekDates = computed(() => {
    return currentMonthDates.value.slice(weekIndex.value * 7, weekIndex.value * 7 + 7)
  })
  // 根据视图模式计算当前渲染页实际渲染的日期
  const currentRenderDates = computed(() => {
    return viewMode.value === 'week' ? currentWeekDates.value : currentMonthDates.value
  })
  // 根据视图模式计算当前渲染页的行数
  const currentRenderRows = computed(() => {
    return viewMode.value === 'week' ? 1 : Math.ceil(currentMonthDates.value.length / 7)
  })

  // 上一渲染页月日期 (初始化取上月)
  const prevMonthDates = ref([])
  _setPrevMonthDates(new Date(currentYear.value, currentMonth.value - 1))
  // 上一渲染页周日期 (初始化取上周)
  const prevWeekDates = ref([])
  _setPrevWeekDates(
    new Date(new Date(currentWeekDates.value[0].date).setDate(currentWeekDates.value[0].date.getDate() - 1))
  )
  // 根据视图模式计算上一渲染页实际渲染的日期
  const prevRenderDates = computed(() => {
    return viewMode.value === 'week' ? prevWeekDates.value : prevMonthDates.value
  })
  // 根据视图模式计算上一渲染页的行数
  const prevRenderRows = computed(() => {
    return viewMode.value === 'week' ? 1 : Math.ceil(prevMonthDates.value.length / 7)
  })

  // 下一渲染页月日期 (初始化取下月)
  const nextMonthDates = ref([])
  _setNextMonthDates(new Date(currentYear.value, currentMonth.value + 1))
  // 下一渲染页周日期 (初始化取下周)
  const nextWeekDates = ref([])
  _setNextWeekDates(
    new Date(new Date(currentWeekDates.value[6].date).setDate(currentWeekDates.value[6].date.getDate() + 1))
  )
  // 根据视图模式计算下一渲染页实际渲染的日期
  const nextRenderDates = computed(() => {
    return viewMode.value === 'week' ? nextWeekDates.value : nextMonthDates.value
  })
  // 根据视图模式计算下一渲染页的行数
  const nextRenderRows = computed(() => {
    return viewMode.value === 'week' ? 1 : Math.ceil(nextMonthDates.value.length / 7)
  })

  // 拼接了上一页、当前页、下一页的渲染日期
  const allRenderDates = computed(() => {
    return [prevRenderDates.value, currentRenderDates.value, nextRenderDates.value]
  })

  // 设置上一渲染页的月日期
  function _setPrevMonthDates(date) {
    prevMonthDates.value = createMonthDates(date, weekStart.value)
  }
  // 设置下一渲染页的月日期
  function _setNextMonthDates(date) {
    nextMonthDates.value = createMonthDates(date, weekStart.value)
  }
  // 设置上一渲染页的周日期
  function _setPrevWeekDates(date) {
    prevWeekDates.value = createWeekDates(date, weekStart.value)
  }
  // 设置下一渲染页的周日期
  function _setNextWeekDates(date) {
    nextWeekDates.value = createWeekDates(date, weekStart.value)
  }

  // 切换视图模式
  function toggleViewMode() {
    viewMode.value = viewMode.value === 'week' ? 'month' : 'week'
    renderRows.value = currentRenderRows.value
    _setWeekIndex()
    emit('view-change', viewMode.value)
  }

  // 切换的目标日期
  const _targetDate = ref(null)

  // 月视图下切换页面到指定日期
  function _switchPageToTargetDateInMonthView(date) {
    if (date.getFullYear() === currentYear.value && date.getMonth() === currentMonth.value) {
      return
    }
    // 1、设置prevMonthDates/nextMonthDates
    let direction
    if (
      date.getFullYear() < currentYear.value ||
      (date.getFullYear() === currentYear.value && date.getMonth() < currentMonth.value)
    ) {
      direction = 'right'
      _setPrevMonthDates(date)
    } else {
      direction = 'left'
      _setNextMonthDates(date)
    }
    _targetDate.value = date
    // 2、开启切换动画
    startTransitionAnimation(direction)
    // 3、监听动画结束事件，并执行相应回调
  }

  // 周视图下切换页面到指定日期
  function _switchPageToTargetDateInWeekView(date) {
    if (currentWeekDates.value.some(item => isSameDay(item.date, date))) {
      if (date.getFullYear() === currentYear.value && date.getMonth() === currentMonth.value) {
        return
      }
      // 目标日期在当前周内，但可能不在当前月份，若不在当前月份需手动设置currentYear/currentMonth
      currentYear.value = date.getFullYear()
      currentMonth.value = date.getMonth()
      _setWeekIndex(date)
      return
    }
    // 1、设置prevWeekDates/nextWeekDates
    let direction
    if (date < currentWeekDates.value[0].date) {
      direction = 'right'
      _setPrevWeekDates(date)
    } else {
      direction = 'left'
      _setNextWeekDates(date)
    }
    _targetDate.value = date
    // 2、开启切换动画
    startTransitionAnimation(direction)
    // 3、监听动画结束事件，并执行相应回调
  }

  // 切换页面到指定日期 (根据当前视图自动判断切月或切周)
  function switchPageToTargetDate(date) {
    if (viewMode.value === 'week') {
      _switchPageToTargetDateInWeekView(date)
    } else if (viewMode.value === 'month') {
      _switchPageToTargetDateInMonthView(date)
    }
  }

  // 设置周索引
  // 查找传入的date或selected所在周的周索引，若找不到则默认为0
  function _setWeekIndex(date) {
    const targetDate = date || selected.value
    if (viewMode.value === 'week') {
      const found = currentMonthDates.value.findIndex(d => isSameDay(d.date, targetDate))
      const idx = Math.max(found, 0)
      weekIndex.value = Math.floor(idx / 7)
    }
  }

  // 移动的距离
  const transformDistance = ref('0px')
  // 动画时间
  const transitionDuration = ref('0s')
  // 是否正在过渡动画过程中
  const isInTransition = ref(false)
  // 页面实际渲染的行数
  const renderRows = ref(currentRenderRows.value)

  // 开始播放过渡动画
  function startTransitionAnimation(direction) {
    transitionDuration.value = duration.value
    isInTransition.value = true
    if (direction === 'left') {
      transformDistance.value = '-100%'
      renderRows.value = nextRenderRows.value
    } else if (direction === 'right') {
      transformDistance.value = '100%'
      renderRows.value = prevRenderRows.value
    } else {
      transformDistance.value = '0px'
    }
  }

  // 监听过渡动画结束
  function onTransitionEnd() {
    transitionDuration.value = '0s'
    if (!_targetDate.value) {
      return (isInTransition.value = false)
    }
    // 设置currentYear/currentMonth
    currentYear.value = _targetDate.value.getFullYear()
    currentMonth.value = _targetDate.value.getMonth()
    renderRows.value = currentRenderRows.value
    transformDistance.value = '0px'
    if (viewMode.value === 'week') {
      _setWeekIndex(_targetDate.value)
      _setPrevWeekDates(
        new Date(new Date(currentWeekDates.value[0].date).setDate(currentWeekDates.value[0].date.getDate() - 1))
      )
      _setNextWeekDates(
        new Date(new Date(currentWeekDates.value[6].date).setDate(currentWeekDates.value[6].date.getDate() + 1))
      )
    } else if (viewMode.value === 'month') {
      _setPrevMonthDates(new Date(currentYear.value, currentMonth.value - 1))
      _setNextMonthDates(new Date(currentYear.value, currentMonth.value + 1))
    }
    _targetDate.value = null
    isInTransition.value = false
  }

  return {
    selected,
    viewMode,
    currentYear,
    currentMonth,
    currentRenderDates,
    allRenderDates,
    transformDistance,
    transitionDuration,
    isInTransition,
    renderRows,
    switchPageToTargetDate,
    startTransitionAnimation,
    onTransitionEnd,
    toggleViewMode
  }
}
