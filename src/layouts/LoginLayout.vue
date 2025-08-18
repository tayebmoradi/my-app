<template >
  <div dir="rtl">


  <q-layout view="lHh Lpr lFf">
    <!-- پس‌زمینه -->
    <div class="login-bg">
      <q-page-container>
        <router-view />
      </q-page-container>
    </div>
  </q-layout>
  </div>
</template>

<script setup>
</script>

<style scoped>
.login-bg {
  background: linear-gradient(135deg, #0d0d0d, #1e1e2f);
  background-image:
    linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)),
    url('https://nazarkade.com/wp-content/uploads/2022/02/best-developer-learning.webp'); /* بک‌گراند کدنویسی */
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  direction: rtl; /* راست‌چین کردن کل صفحه */
}

.q-layout {
  direction: rtl;
  text-align: right;
}

/* راست‌چین کردن هدر */
.custom-header {
  direction: rtl;
}

/* راست‌چین کردن دکمه‌ها */
.actions-cell {
  direction: rtl;
}

/* راست‌چین کردن دیالوگ */
.q-dialog {
  direction: rtl;
}
</style>
