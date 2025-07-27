<template>
  <div
    class="mw-calendar-container"
    :style="{
      '--calendar-rows': renderRows,
      '--calendar-transition-duration': duration,
      '--translate-distance': transformDistance,
      '--transition-duration': transitionDuration
    }"
  >
    <!-- Toolbar -->
    <div v-if="showToolbar" class="mw-calendar-toolbar">
      <slot name="toolbar" :year="currentYear" :month="currentMonth" :isWeekView="isWeekView">
        <div v-html="icons.arrowDoubleLeft" class="mw-calendar-toolbar--icon" @click="changeMonth(-12)" />
        <div v-html="icons.arrowLeft" class="mw-calendar-toolbar--icon" @click="onTransitionStart('right')" />
        <div class="mw-calendar-toolbar--text">{{ headerLabel }}</div>
        <div v-html="icons.arrowRight" class="mw-calendar-toolbar--icon" @click="onTransitionStart('left')" />
        <div v-html="icons.arrowDoubleRight" class="mw-calendar-toolbar--icon" @click="changeMonth(12)" />
      </slot>
    </div>

    <!-- Weekdays Header -->
    <div v-if="showWeekdays" class="mw-calendar-weekdays">
      <div v-for="day in weekdays" :key="day" class="mw-calendar-weekdays--weekday">{{ day }}</div>
    </div>

    <!-- Calendar Grid -->
    <div ref="swp" class="mw-calendar-wrapper">
      <div
        v-for="(item, index) in renderDates"
        :key="index"
        :style="{ left: 100 * (index - 1) + '%' }"
        class="mw-calendar-days"
        @transitionend="onTransitionEnd"
      >
        <div
          v-for="dateObj in item"
          :key="dateObj.key"
          :class="{ 'is-selected': isSameDay(dateObj.date, selected), 'other-month': !dateObj.current }"
          class="mw-calendar-day"
          @click="selectDate(dateObj)"
        >
          <div class="mw-calendar-day--inner">
            <div class="mw-calendar-day--inner-value">{{ dateObj.fullDate.date }}</div>
            <div class="mw-calendar-day--inner-label" v-if="$slots['day-label']">
              <slot name="day-label" :date="dateObj.date" />
            </div>
          </div>
          <div class="mw-calendar-day--marker" :style="{ background: _getMarkerColor(dateObj.date) }" />
        </div>
      </div>
    </div>

    <!-- Calendar Footer -->
    <div v-if="showFooter" class="mw-calendar-footer">
      <div v-html="isWeekView ? icons.arrowDown : icons.arrowUp" class="mw-calendar-footer--icon" @click="toggleView" />
    </div>
  </div>
</template>

<script setup>
import { useTemplateRef, toRefs, computed } from 'vue'
import { useSwipe } from '@vueuse/core'
import { useCalendar } from './hooks/useCalendar.js'
import { isSameDay } from './utils'
import { icons } from './utils/icons.js'

const emit = defineEmits(['select-change'])
const swipeRef = useTemplateRef('swp')

const props = defineProps({
  // 初始选中的日期
  initialSelectedDate: {
    type: Date,
    default: () => new Date()
  },
  // 以周几作为每周的起始
  weekStart: {
    type: Number,
    default: 0 // 0: Sunday, 1: Monday, etc.
  },
  // 标记的日期
  markerDates: {
    type: Array,
    default: () => []
  },
  // 初始是否为周视图
  initialWeekView: {
    type: Boolean,
    default: false
  },
  // 是否显示顶部工具栏
  showToolbar: {
    type: Boolean,
    default: true
  },
  // 是否显示底部工具栏
  showFooter: {
    type: Boolean,
    default: true
  },
  // 是否显示weekdays栏
  showWeekdays: {
    type: Boolean,
    default: true
  },
  // 过渡动画时长
  duration: {
    type: String,
    default: '0.3s'
  }
})

const { initialSelectedDate, initialWeekView, weekStart, markerDates, duration } = toRefs(props)

const {
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
  selectDate,
  toggleView,
  changeMonth,
  onTransitionStart,
  onTransitionEnd
} = useCalendar({ initialSelectedDate, initialWeekView, weekStart, markerDates, duration }, emit)

// 顶部工具栏标题
const headerLabel = computed(() => `${currentYear.value}年${currentMonth.value + 1}月`)

// 监听滑动事件
const { lengthX } = useSwipe(swipeRef, {
  threshold: 0, // 滑动阈值
  // 手指滑动过程中
  onSwipe: () => {
    if (isSwiping.value) return
    transformDistance.value = -lengthX.value + 'px'
  },
  // 手指抬起滑动结束，开始滑动动画
  onSwipeEnd: (_, direction) => {
    if (isSwiping.value) return
    onTransitionStart(direction)
  }
})

// 获取 marker 颜色
function _getMarkerColor(date) {
  return markerDateList.value.find(d => isSameDay(d.date, date))?.color
}

defineExpose({
  // 切换周/月视图
  toggleView,
  // 切换到上一年(无动画)
  goPrevYear() {
    changeMonth(-12)
  },
  // 切换到下一年(无动画)
  goNextYear() {
    changeMonth(12)
  },
  // 根据周/月视图，切换到上一月/周(有动画)
  goPrev() {
    onTransitionStart('right')
  },
  // 根据周/月视图，切换到下一月/周(有动画)
  goNext() {
    onTransitionStart('left')
  }
})
</script>
