<template>
  <q-page class="flex flex-center">
    <q-card style="width: 350px; padding: 20px" class="text-right">
      <q-card-section>
        <div class="text-h6">ورود به سیستم</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="username"
          label="نام کاربری"
          outlined
          dense
          autofocus
        />
        <q-input
          v-model="password"
          label="رمز عبور"
          type="password"
          outlined
          dense
          class="q-mt-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="ورود"
          color="primary"
          @click="login"
          :loading="loading"
          :disable="loading"
        />
      </q-card-actions>

      <q-card-section>
        <q-btn
          label="دریافت اطلاعات محرمانه"
          color="secondary"
          @click="fetchSecret"
          class="full-width"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()
const $q = useQuasar()
const username = ref('')
const password = ref('')

const login = async () => {
  try {
    const res = await axios.post('https://localhost:7196/api/Auth/login', {
      username: username.value,
      password: password.value
    })
    localStorage.setItem('token', res.data.token)
    $q.notify({ type: 'positive', message: 'ورود موفقیت‌آمیز بود' })
    router.push('/dashboard')
    // مثلا ریدایرکت به داشبورد
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'خطا در ورود' })
  }
}
</script>
<style scoped>
.q-page {
  direction: rtl; /* راست‌چین */
}
</style>
