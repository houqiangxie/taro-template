/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-10-12 10:24:00
 * @LastEditors: houqiangxie
 * @LastEditTime: 2023-10-17 14:47:42
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'uno.css'
import './app.scss'
import './router'
const App = createApp({
  onShow(options) {
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
// 引用全部组件
App.use(createPinia())
export default App
