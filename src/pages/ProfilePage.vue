<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card class="my-card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">پروفایل کاربری</div>
          </q-card-section>

          <q-card-section>
            <div v-if="loading" class="text-center q-pa-md">
              <q-spinner color="primary" size="3em" />
              <div class="q-mt-sm">در حال دریافت اطلاعات پروفایل...</div>
            </div>

            <div v-else class="row q-col-gutter-md">
              <!-- بخش تصویر پروفایل -->
              <div class="col-12 col-md-4 text-center">
                <q-avatar size="120px" class="q-mb-sm">
                  <img :src="user.avatar || 'default-avatar.png'">
                </q-avatar>
              </div>

              <!-- بخش اطلاعات کاربر -->
              <div class="col-12 col-md-8">
                <div class="q-pa-md">
                  <div class="text-h6 q-mb-md">اطلاعات شخصی</div>

                  <div class="info-item q-mb-md">
                    <div class="text-caption text-grey">نام کامل:</div>
                    <div class="text-body1">{{ user.name || '--' }}</div>
                  </div>

                  <div class="info-item q-mb-md">
                    <div class="text-caption text-grey">ایمیل:</div>
                    <div class="text-body1">{{ user.email || '--' }}</div>
                  </div>

                  <div class="info-item q-mb-md">
                    <div class="text-caption text-grey">تلفن همراه:</div>
                    <div class="text-body1">{{ user.phoneNumber || '--' }}</div>
                  </div>

                  <div class="info-item q-mb-md" v-if="user.userId">
                    <div class="text-caption text-grey">شناسه کاربری:</div>
                    <div class="text-body1">{{ user.userId }}</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

export default {
  setup() {
    const $q = useQuasar()
    const loading = ref(true)
    const user = ref({
      name: '',
      email: '',
      phoneNumber: '',
      avatar: '',
      userId: ''
    })

    function parseJwt(token) {
      if (!token) return null
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        return JSON.parse(jsonPayload)
      } catch (e) {
        console.error('Error decoding JWT payload', e)
        return null
      }
    }

    const fetchUserProfile = async () => {
      loading.value = true
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('توکن احراز هویت یافت نشد')
        }

        const userData = parseJwt(token)
        const userId = userData?.unique_name || userData?.sub
        if (!userId) {
          throw new Error('شناسه کاربر یافت نشد')
        }

        const response = await api.get(`https://localhost:7196/api/Auth/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        // پر کردن داده‌های کاربر
        user.value = {
          name: response.data.name || response.data.fullName || '--',
          email: response.data.email || '--',
          phoneNumber: response.data.phoneNumber || response.data.phone || '--',
          avatar: response.data.avatar || response.data.profileImage || '',
          userId: userId
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        $q.notify({
          type: 'negative',
          message: 'خطا در دریافت اطلاعات پروفایل'
        })
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchUserProfile()
    })

    return {
      user,
      loading
    }
  }
}
</script>

<style scoped>
.my-card {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.q-avatar img {
  object-fit: cover;
}

.info-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}
</style>
