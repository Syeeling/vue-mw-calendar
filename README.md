# vue-md-calendar

![vue](https://img.shields.io/npm/dependency-version/vue-mw-calendar/peer/vue?color=42B883 "vue")
[![npm](https://img.shields.io/npm/v/vue-mw-calendar?label=npm "npm")](https://www.npmjs.com/package/vue-mw-calendar)
![mit](https://img.shields.io/npm/l/vue-mw-calendar)

### 示意

***

月视图：  
<img src="https://raw.githubusercontent.com/Syeeling/vue-mw-calendar/refs/heads/master/src/images/month-view.png" alt="month-view" />

<br />

周视图：  
<img src="https://raw.githubusercontent.com/Syeeling/vue-mw-calendar/refs/heads/master/src/images/week-view.png" alt="week-view" />

<br />

### 安装

***

```bash
# using npm
npm install vue-mw-calendar --save

# or using yarn
yarn add vue-mw-calendar
```

<br />

### 全局注册

***

```javascript
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

// 全局引入组件
import MwCalendar from 'vue-mw-calendar'
app.use(MwCalendar)
// 引入组件样式
import 'vue-mw-calendar/dist/index.css'  // web端样式
// import 'vue-mw-calendar/dist/mobile.css'  // 移动端样式

app.mount('#app')
```

<br />

### 局部注册

***

```Vue
<script setup>
import { MwCalendar } from 'vue-mw-calendar'
import 'vue-mw-calendar/dist/index.css'  // web端样式
// import 'vue-mw-calendar/dist/mobile.css'  // 移动端样式
</script>
```

<br />

### 使用

***

#### 基础用法

```Vue
<template>
  <mw-calendar />
</template>

<script setup>
import { MwCalendar } from 'vue-mw-calendar'
import 'vue-mw-calendar/dist/index.css'
</script>
```

#### 标记日期

```Vue
<template>
  <mw-calendar :week-start="1" :marker-dates="markerDates" />
</template>

<script setup>
import { MwCalendar } from 'vue-mw-calendar'
import 'vue-mw-calendar/dist/index.css'

const markerDates = [
  '2025-08-04',  // 可以直接传入一个日期字符串
  '2025-08-05',
  // 也可以传入一个对象，用以自定义标记的颜色
  {
    date: '2025-08-06',
    color: '#ff6a6a'
  }
]
</script>
```

<br />

### API

***

#### 属性

| 属性名                | 说明                              | 类型          | 默认值       |
| :-------------------- | :-------------------------------- | :------------ | :----------- |
| initial-selected-date | 初始选中的日期                    | `Date`        | `new Date()` |
| initial-view-mode     | 初始的日历视图模式，可选 `'week'` | `String`      | `'month'`    |
| week-start            | 以周几作为每周的起始              | `Number`      | `0`          |
| marker-dates          | 底部打圆点标记的日期              | `Array`       | `[]`         |
| ~~initial-week-view~~ | ~~初始是否为周视图~~              | ~~`Boolean`~~ | ~~`false`~~  |
| show-toolbar          | 是否显示顶部工具栏                | `Boolean`     | `true`       |
| show-footer           | 是否显示底部视图切换工具栏        | `Boolean`     | `true`       |
| show-weekdays         | 是否显示星期栏                    | `Boolean`     | `true`       |
| duration              | 过渡动画时长                      | `String`      | `'0.3s'`     |

#### 插槽

| 名称      | 说明                           | 参数                                                |
| :-------- | :----------------------------- | :-------------------------------------------------- |
| toolbar   | 自定义顶部工具栏               | `{ year: string, month: string, viewMode: string }` |
| day-label | 自定义日期下方描述信息         | `{ date: Date }`                                    |
| weekday   | 自定义星期栏中每一个格子的内容 | `{ weekday: string, index: number }`                |
| footer    | 自定义底部工具栏               | `{ year: string, month: string, viewMode: string }` |

#### 事件

| 事件名        | 说明                       | 回调参数       |
| :------------ | :------------------------- | :------------- |
| select-change | 当前选中日期变化时触发     | `selectedDate` |
| view-change   | 当前日历视图模式切换时触发 | `viewMode`     |

#### 方法

| 方法名             | 说明                                                         | 参数                    | 返回值 |
| :----------------- | :----------------------------------------------------------- | :---------------------- | :----- |
| ~~toggleView~~     | ~~切换周/月视图~~                                            | -                       | -      |
| ~~goPrevYear~~     | ~~切换当前年份至前一年(无动画)~~                             | -                       | -      |
| ~~goNextYear~~     | ~~切换当前年份至后一年(无动画)~~                             | -                       | -      |
| ~~goPrev~~         | ~~切换视图到上一页(当前月视图则切换到上一月，当前周视图则切换到上一周，有动画)~~ | -                       | -      |
| ~~goNext~~         | ~~切换视图到下一页(当前月视图则切换到下一月，当前周视图则切换到下一周，有动画)~~ | -                       | -      |
| toggleViewMode     | 切换周/月视图                                                | -                       | -      |
| changePageTo       | 切换日历页，参数可选为：<br />`'prev-page'`：切换至上一页<br />`'next-page'`：切换至下一页<br />`'prev-year'`：切换至前一年<br />`'next-year'`：切换至后一年<br />一个合法的日期：切换至该日期所在的页<br />以上切换均有过渡动画效果 | `param: String \| Date` | -      |
| changeSelectedDate | 切换选中日期至指定日期                                       | `date: Date`            | -      |

#### 样式变量

组件提供了下列css变量，可用于自定义样式：

> 其中 "/" 前的为 `index.css` 中样式，"/" 后的为 `mobile.css` 中样式，`mobile.css` 中的 `px` 单位已转换成 `vw` 用作移动端适配，以 `750px` 为设计尺寸。

| 名称                                  | 默认值                                | 描述   |
| :---------------------------------- | :--------------------------------- | :--- |
| --calendar-text-color-level-1       | #303133                            | -    |
| --calendar-text-color-level-2       | #606266                            | -    |
| --calendar-text-color-level-3       | #909399                            | -    |
| --calendar-text-color-level-4       | #a8abb2                            | -    |
| --calendar-text-color-level-5       | #c0c4cc                            | -    |
| --calendar-theme-color              | #409eff                            | 主题颜色 |
| --calendar-background               | transparent                        | -    |
| --calendar-row-height               | 60px / 120px                       | -    |
| --calendar-icon-size                | 20px / 40px                        | -    |
| --calendar-icon-color               | var(--calendar-text-color-level-3) | -    |
| --calendar-toolbar-font-size        | 16px / 32px                        | -    |
| --calendar-toolbar-icon-size        | var(--calendar-icon-size)          | -    |
| --calendar-toolbar-icon-color       | var(--calendar-icon-color)         | -    |
| --calendar-toolbar-column-gap       | 16px / 32px                        | -    |
| --calendar-toolbar-padding          | 12px 16px / 24px 32px              | -    |
| --calendar-footer-icon-size         | var(--calendar-icon-size)          | -    |
| --calendar-footer-icon-color        | var(--calendar-icon-color)         | -    |
| --calendar-footer-padding           | 12px / 24px                        | -    |
| --calendar-weekdays-height          | 30px / 60px                        | -    |
| --calendar-weekdays-font-size       | 14px / 28px                        | -    |
| --calendar-weekdays-color           | var(--calendar-text-color-level-1) | -    |
| --calendar-days-value-font-size     | 14px / 28px                        | -    |
| --calendar-days-value-color         | var(--calendar-text-color-level-1) | -    |
| --calendar-days-label-font-size     | 10px / 20px                        | -    |
| --calendar-days-label-color         | var(--calendar-text-color-level-2) | -    |
| --calendar-days-selected-color      | #fff                               | -    |
| --calendar-days-selected-background | var(--calendar-theme-color)        | -    |
| --calendar-days-other-month-color   | var(--calendar-text-color-level-5) | -    |
| --calendar-days-inner-size          | 34px / 68px                        | -    |
| --calendar-days-inner-width         | var(--calendar-days-inner-size)    | -    |
| --calendar-days-inner-height        | 2px / 4px                          | -    |
| --calendar-days-inner-padding       | var(--calendar-days-inner-size)    | -    |
| --calendar-days-inner-radius        | 50%                                | -    |
| --calendar-days-inner-background    | transparent                        | -    |
| --calendar-days-marker-top-gap      | 4px / 8px                          | -    |
| --calendar-days-marker-size         | 4px / 8px                          | -    |
| --calendar-days-marker-color        | var(--calendar-theme-color)        | -    |

<br />

### 更新日志

***

### 0.1.0 (2025.8.17)

核心逻辑代码重构优化

BreakingChanges

- 移除属性： `initialWeekView` 
- 移除方法： `toggleView` `goPrevYear` `goNextYear` `goPrev` `goNext` 
- 插槽 `toolbar` 移除属性 `isWeekView`，添加属性 `viewMode` 

Features

- 添加属性： `initialViewMode` ，可选值 `'month'` `'week'`，默认值 `'month'` 
- 添加事件： `view-change` 
- 添加插槽： `weekday` `footer` 
- 添加方法： `toggleViewMode` `changePageTo` 

Fix

* 修复当手指上下滑动时，日历页会卡住的问题

<br />

### 0.0.4 (2025.8.8)

Fix

* 修复切换选中日期到其他月份时，没有重新计算行数的问题

<br />

### 0.0.3 (2025.8.2)

Features

* 添加 `changeSelectedDate` 方法

<br />

### License

***

[MIT](https://github.com/Syeeling/vue-mw-calendar/blob/master/LICENSE)

