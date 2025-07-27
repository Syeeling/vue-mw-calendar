## vue-mw-calendar

A lightweight and customizable Vue 3 calendar component library, supporting both month and week views with touch/swipe navigation, built on Vue 3.5.x.

---

### Features

* **Month and Week Views**: Toggle between full month and single-week display.
* **Swipe Navigation**: Touch and drag to move between months or weeks.
* **ES-Only Build**: Ships as ES modules, ideal for modern toolchains.
* **Adaptive CSS**: Two CSS bundles:

  * `index.css` (pixel-based) for desktop
  * `mobile.css` (viewport-based) for mobile
* **Customizable**: Expose props and slots for header labels, event rendering, and more.
* **No Runtime Dependencies**: Vue and @vueuse/core marked as externals.

---

### Installation

```bash
# Using npm
npm install vue-mw-calendar

# Using yarn
yarn add vue-mw-calendar
```

### Quick Start

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'

// Import component & styles
import MwCalendar from 'vue-mw-calendar'
import 'vue-mw-calendar/dist/index.css' // desktop styles
// import 'vue-mw-calendar/dist/mobile.css' // mobile styles

const app = createApp(App)
app.use(MwCalendar)
app.mount('#app')
```

```html
<!-- App.vue -->
<template>
  <div>
    <mw-alendar
      :week-start="1"
      :marker-dates="['2025-07-27', '2025-07-28']"
      @select-change="onSelectChange"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    function onSelectChange(selected) {
      console.log('Selected date:', selected)
    }
  }
}
</script>
```

---

### Props

| Name          | Type     | Default      | Description                               |
| ------------- | -------- | ------------ | ----------------------------------------- |
| `initialSelectedDate` | `Date`   | `new Date()` | Initial selected date.  |
| `weekStart`   | `Number` | `0`          | The first day of the week. |
| `markerDates` | `String[]` | `[]`       | The dates marked at the bottom. |
| `initialWeekView` | `Boolean` | `false` | Is it a weekly view initially. |
| `showToolbar` | `Boolean` | `true`      | show toolbar. |
| `showFooter`  | `Boolean` | `true`      | show footer. |
| `showWeekdays`| `Boolean` | `true`      | show weekdays. |
| `duration`    | `String`  | `'0.3s'`    | The duration of the transition animation. |

---

### Events

| Event         | Payload                   | Description                   |
| ------------- | ------------------------- | ----------------------------- |
| `select-change` | selectedDate            | Emitted when selected date changed. |

---

### Slots

* `toolbar`: Customize the toolbar in header.
* `day-label`: Custom render function for each day label.

```html
<mw-calendar>
  <template #day-label="{ date }">
    {{ date.getDate() }}
  </template>
</mw-calendar>
```

---

### Theming & Styles

* You can override CSS custom properties in your project:

```css
:root {
  --calendar-primary-color: #409eff;
  --calendar-header-font-size: 20px;
}
```

---
