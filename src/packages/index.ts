import type { App } from 'vue'
import MwCalendar from './Calendar/Calendar.vue'
import './Calendar/style/index.scss'

const components = [{ name: 'MwCalendar', comp: MwCalendar }]

export { MwCalendar }

export default {
  install(app: App) {
    components.forEach(({ name, comp }) => {
      app.component(name, comp)
    })
  }
}

declare module 'vue' {
  export interface GlobalComponents {
    MwCalendar: typeof MwCalendar
  }
}
