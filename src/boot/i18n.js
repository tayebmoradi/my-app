import { createI18n } from 'vue-i18n'
import fa from 'src/i18n/fa'
import en from 'src/i18n/en'

const i18n = createI18n({
  locale: 'fa', // زبان پیش‌فرض
  fallbackLocale: 'en',
  messages: {
    fa,
    en
  }
})

export default ({ app }) => {
  app.use(i18n)
}

export { i18n }
