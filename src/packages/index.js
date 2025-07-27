import MwCalendar from './Calendar/Calendar.vue'
import './Calendar/style/index.scss'

const components = [{ name: 'MwCalendar', comp: MwCalendar }]

export { MwCalendar }

export default {
  install(app) {
    components.forEach(({ name, comp }) => {
      app.component(name, comp)
    })
  }
}
