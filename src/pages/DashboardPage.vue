<template>
  <q-card class="q-pa-md shadow-2 rounded-borders" :class="directionClass">
    <!-- Header -->
    <q-card-section class="row justify-between items-center">
      <div class="text-h6 text-primary">
        <q-icon name="list_alt" class="q-mr-sm" /> {{ $t('logsWidget') }}
      </div>
      <q-btn-dropdown flat icon="language" class="text-primary">
        <q-list>
          <q-item clickable v-ripple @click="changeLang('fa')">
            <q-item-section avatar>🇮🇷</q-item-section>
            <q-item-section>فارسی</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="changeLang('en')">
            <q-item-section avatar>🇬🇧</q-item-section>
            <q-item-section>English</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-card-section>

    <!-- Logs List -->
    <q-card-section style="max-height: 200px; overflow-y: auto;">
      <q-list dense>
        <q-item
          v-for="log in recentLogs"
          :key="log.id"
          clickable
          v-ripple
          class="bg-grey-1 q-mb-xs rounded-borders"
        >
          <q-item-section avatar>
            <q-icon name="history" color="primary" />
          </q-item-section>
          <q-item-section>
            <div class="text-subtitle2 text-bold">
              {{ log.username }}
            </div>
            <div class="text-caption text-grey">
              {{ new Date(log.date).toLocaleString() }}
            </div>
          </q-item-section>
          <q-item-section side>
            <q-chip dense outline color="primary" text-color="primary">
              {{ log.action }}
            </q-chip>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- Footer -->
    <q-card-actions align="right">
      <q-btn :label="$t('showAllLogs')" color="primary" unelevated icon="visibility" @click="goToLogs" />
    </q-card-actions>
  </q-card>
</template>

<script>
import axios from 'axios'
import { i18n } from 'boot/i18n'

export default {
  data() {
    return {
      recentLogs: [],
      directionClass: ''
    }
  },
  async mounted() {
    this.applyDirection(localStorage.getItem('lang') || 'fa')
    try {
      const res = await axios.get('https://localhost:7196/api/Auth/logs?limit=5', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      this.recentLogs = res.data
    } catch (error) {
      console.error(this.$t('fetchLogsError'), error)
    }
  },
  methods: {
    goToLogs() {
      this.$router.push('/logs')
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    changeLang(lang) {
      i18n.global.locale = lang
      localStorage.setItem('lang', lang)
      this.applyDirection(lang)
    },
    applyDirection(lang) {
      const dir = lang === 'fa' ? 'rtl' : 'ltr'
      document.documentElement.setAttribute('dir', dir)
      this.directionClass = dir === 'rtl' ? 'text-right' : 'text-left'
    }
  },
}
</script>

<style scoped>
.text-right {
  direction: rtl;
}
.text-left {
  direction: ltr;
}
.rounded-borders {
  border-radius: 12px;
}
</style>
