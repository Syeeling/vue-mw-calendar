// 导入assets目录下所有图标
const modules = import.meta.glob('../assets/*.svg', { eager: true, query: '?raw', import: 'default' })

// 把形如 './assets/arrow-left.svg?raw' → 'arrowLeft' 做一次映射
export const icons = Object.fromEntries(
  Object.entries(modules).map(([path, raw]) => {
    const name = path
      .split('/')
      .pop() // e.g. "arrow-left.svg"
      .replace('.svg', '') // => "arrow-left"
    const camel = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) // => "arrowLeft"
    return [camel, raw]
  })
)
