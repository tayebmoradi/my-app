// src/boot/axios.js
import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:7196/api'  // آدرس API خودت
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default boot(({ app }) => {
  // اینجا api رو به عنوان global property اضافه می‌کنیم
  app.config.globalProperties.$api = api
})

export { api }
