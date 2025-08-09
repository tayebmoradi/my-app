<template>
  <div>
    <h2>ویجت لاگ‌ها</h2>
    <ul>
      <li v-for="log in recentLogs" :key="log.id">
        {{ new Date(log.date).toLocaleString() }} - {{ log.username }} - {{ log.action }}
      </li>
    </ul>
    <q-btn label="نمایش همه لاگ‌ها" color="primary" @click="goToLogs" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      recentLogs: []
    }
  },
  async mounted() {
    try {
      const res = await axios.get('https://localhost:7196/api/Auth/logs?limit=5', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      this.recentLogs = res.data;
    } catch (error) {
      console.error('خطا در دریافت لاگ‌ها:', error)
    }
  },
  methods: {
    goToLogs() {
      this.$router.push('/logs')
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>
