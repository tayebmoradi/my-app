<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <h6>آخرین لاگ‌ها</h6>
        <q-list>
          <q-item v-for="log in logs" :key="log.id">
            <q-item-section>
              <div>کاربر: {{ log.username }}</div>
              <div>عملیات: {{ log.action }}</div>
              <div>تاریخ: {{ new Date(log.date).toLocaleString() }}</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const logs = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('https://localhost:7196/api/Auth/logs', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    logs.value = res.data
  } catch (error) {
    console.error('خطا در دریافت لاگ‌ها:', error)
  }
})
</script>
