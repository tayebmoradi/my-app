<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Quasar App</q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>

        <!-- دکمه تغییر زبان -->
        <q-btn-dropdown label="🌐" flat>
          <q-list>
            <q-item clickable v-ripple @click="changeLang('fa')">
              <q-item-section>🇮🇷 فارسی</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="changeLang('en')">
              <q-item-section>🇬🇧 English</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Essential Links</q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          @action="handleAction"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { i18n } from 'boot/i18n'

const linksList = [
  { title: 'محصولات', caption: 'quasar.dev', icon: 'school', to: '/products' },
  { title: 'پروفایل', caption: 'github.com/quasarframework', icon: 'code', to: '/profile' },
  { title: 'Discord Chat Channel', caption: 'chat.quasar.dev', icon: 'chat', link: 'https://chat.quasar.dev' },
  { title: 'Forum', caption: 'forum.quasar.dev', icon: 'record_voice_over', link: 'https://forum.quasar.dev' },
  { title: 'خروج', caption: '', icon: 'logout', action: 'logout' }, // اینجا
]

const leftDrawerOpen = ref(false)
const router = useRouter()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function changeLang(lang) {
  i18n.global.locale = lang
  localStorage.setItem('lang', lang)
  document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr')
}

onMounted(() => {
  const savedLang = localStorage.getItem('lang')
  if (savedLang) {
    i18n.global.locale = savedLang
    document.documentElement.setAttribute('dir', savedLang === 'fa' ? 'rtl' : 'ltr')
  }
})

async function logout() {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('شما قبلاً خارج شده‌اید')
      router.push('/login')
      return
    }

    await axios.post(
      'https://localhost:7196/api/Auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    localStorage.removeItem('token')
    router.push('/login')
  } catch (error) {
    console.error('خطا در لاگ‌اوت:', error)
    alert(error.response?.status === 401 ? 'توکن نامعتبر است' : 'خطا در خروج از سیستم')
    localStorage.removeItem('token')
    router.push('/login')
  }
}

// این تابع برای دریافت event از کامپوننت EssentialLink است
function handleAction(actionName) {
  if (actionName === 'logout') {
    logout()
  }
}
</script>
