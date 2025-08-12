<template>
  <q-page padding>
    <q-card class="shadow-2 rounded-borders">
      <!-- عنوان -->
      <q-card-section class="row justify-between items-center">
        <div class="text-h6 text-primary">
          <q-icon name="history" class="q-mr-sm" /> آخرین لاگ‌ها
        </div>
        <q-btn
          dense
          flat
          color="primary"
          icon="visibility"
          label="مشاهده همه"
          @click="goToLogs"
        />
      </q-card-section>

      <!-- بدنه -->
      <q-separator />

      <q-card-section style="max-height: 250px; overflow-y: auto;">
        <!-- بدون لاگ -->
        <div v-if="recentLogs.length === 0" class="text-grey text-center q-mt-md">
          <q-icon name="info" size="sm" /> لاگی وجود ندارد
        </div>

        <!-- با لاگ -->
        <q-list v-else bordered separator>
          <q-item v-for="log in recentLogs" :key="log.id" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="person" color="primary" />
            </q-item-section>

            <q-item-section>
              <div class="text-subtitle2">{{ log.username || log.userName }}</div>
              <div class="text-caption text-grey">{{ log.action }}</div>
            </q-item-section>

            <q-item-section side>
              <q-chip dense color="grey-3" text-color="black">
                {{ formatDate(log.date || log.logDate) }}
              </q-chip>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      recentLogs: [],
    }
  },
  async mounted() {
    try {
      const res = await axios.get('https://localhost:7196/api/Auth/getlogs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      console.log('API Logs:', res.data)
      this.recentLogs = res.data || []
    } catch (error) {
      console.error('خطا در دریافت لاگ‌ها:', error)
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '---'
      const d = new Date(date)
      return isNaN(d.getTime()) ? '---' : d.toLocaleString()
    },
    goToLogs() {
      this.$router.push('/logs')
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>
