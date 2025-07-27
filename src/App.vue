<template>
  <div class="app-container">
    <Calendar ref="calendarRef" :markerDates :weekStart :initial-week-view="false" />
  </div>
</template>

<script setup>
import { useTemplateRef, ref } from 'vue'
import Calendar from './packages/Calendar/Calendar.vue'
import '/src/packages/Calendar/style/mobile/mobile.scss'

const calendarRef = useTemplateRef('calendarRef')

const markerDates = [
  '2025-07-04',
  '2025-07-05',
  '2025-07-06',
  '2025-07-07',
  {
    date: '2025-07-08',
    color: '#ff6a6a'
  }
]

const weekStart = ref(1)
</script>

<style></style>
